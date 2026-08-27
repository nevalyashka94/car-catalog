import { useState, useMemo, useEffect, useRef } from "react";
import { Car } from "../../types/car";
import { loadCatalog } from "../../services/catalog";
import CatalogCard from "./CatalogCard";
import { CatalogFilterState } from "../ai/CatAssistant";

interface CatalogProps {
  initialFilters?: CatalogFilterState;
}

const PRICE_PRESETS = [
  "До 2 млн ₽",
  "2–3 млн ₽",
  "3–4 млн ₽",
  "4–5 млн ₽",
  "5+ млн ₽",
];

// Форматирование чисел: 3500000 -> 3 500 000
function formatNumberWithSpaces(val: string): string {
  const digitsOnly = val.replace(/\D/g, "");
  if (!digitsOnly) return "";
  return Number(digitsOnly).toLocaleString("ru-RU");
}

// Подсказка цены: 3500000 -> 3.5 млн ₽
function getReadablePriceHint(val: string): string | null {
  const num = Number(val.replace(/\D/g, ""));
  if (!num || isNaN(num)) return null;
  if (num >= 1_000_000) {
    const mln = (num / 1_000_000).toFixed(1).replace(".0", "");
    return `${mln} млн ₽`;
  }
  if (num >= 1_000) {
    const th = (num / 1_000).toFixed(0);
    return `${th} тыс. ₽`;
  }
  return `${num.toLocaleString("ru-RU")} ₽`;
}

export default function Catalog({ initialFilters }: CatalogProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // Фильтры
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedBody, setSelectedBody] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [minPriceInput, setMinPriceInput] = useState<string>("");
  const [maxPriceInput, setMaxPriceInput] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Дропдауны
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isBodyOpen, setIsBodyOpen] = useState(false);

  const brandRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCatalog()
      .then((data) => setCars(data))
      .finally(() => setLoading(false));
  }, []);

  // Закрытие дропдаунов при клике вне области
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (brandRef.current && !brandRef.current.contains(e.target as Node)) {
        setIsBrandOpen(false);
      }
      if (bodyRef.current && !bodyRef.current.contains(e.target as Node)) {
        setIsBodyOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Синхронизация с командами AI кота
  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.brand) setSelectedBrand(initialFilters.brand);
      if (initialFilters.body) setSelectedBody(initialFilters.body);
      if (initialFilters.searchQuery) setSearchTerm(initialFilters.searchQuery);

      if (initialFilters.minPrice) setMinPriceInput(String(initialFilters.minPrice));
      if (initialFilters.maxPrice) setMaxPriceInput(String(initialFilters.maxPrice));
      if (initialFilters.minPrice || initialFilters.maxPrice) setSelectedPrice("");
    }
  }, [initialFilters]);

  const brandsList = useMemo(() => {
    const set = new Set(cars.map((c) => c.brand?.name).filter(Boolean) as string[]);
    return Array.from(set).sort();
  }, [cars]);

  const bodiesList = useMemo(() => {
    const set = new Set(cars.map((c) => c.body).filter(Boolean) as string[]);
    return Array.from(set).sort();
  }, [cars]);

  const hasActiveFilters = Boolean(
    selectedBrand || selectedBody || selectedPrice || minPriceInput || maxPriceInput || searchTerm
  );

  const minHint = getReadablePriceHint(minPriceInput);
  const maxHint = getReadablePriceHint(maxPriceInput);

  // Фильтрация
  const filteredCars = useMemo(() => {
    const minVal = minPriceInput ? parseFloat(minPriceInput) : null;
    const maxVal = maxPriceInput ? parseFloat(maxPriceInput) : null;

    return cars.filter((car) => {
      // 1. Поиск по строке
      if (searchTerm.trim()) {
        const full = `${car.brand?.name || ""} ${car.model || ""}`.toLowerCase();
        if (!full.includes(searchTerm.toLowerCase().trim())) return false;
      }

      // 2. Бренд
      if (selectedBrand) {
        const bName = car.brand?.name?.toLowerCase() || "";
        if (!bName.includes(selectedBrand.toLowerCase())) return false;
      }

      // 3. Кузов
      if (selectedBody) {
        const bBody = car.body?.toLowerCase() || "";
        if (!bBody.includes(selectedBody.toLowerCase())) return false;
      }

      // 4. Пресет цены
      const carPrice = car.priceFrom || car.priceTo || 0;
      if (selectedPrice && carPrice > 0) {
        if (selectedPrice === "До 2 млн ₽" && carPrice > 2000000) return false;
        if (selectedPrice === "2–3 млн ₽" && (carPrice < 2000000 || carPrice > 3000000)) return false;
        if (selectedPrice === "3–4 млн ₽" && (carPrice < 3000000 || carPrice > 4000000)) return false;
        if (selectedPrice === "4–5 млн ₽" && (carPrice < 4000000 || carPrice > 5000000)) return false;
        if (selectedPrice === "5+ млн ₽" && carPrice < 5000000) return false;
      }

      // 5. Диапазон цен
      if (carPrice > 0) {
        if (minVal !== null && carPrice < minVal) return false;
        if (maxVal !== null && carPrice > maxVal) return false;
      }

      return true;
    });
  }, [cars, searchTerm, selectedBrand, selectedBody, selectedPrice, minPriceInput, maxPriceInput]);

  if (loading) {
    return (
      <div className="py-24 text-center font-bold text-slate-500">
        Загрузка каталога...
      </div>
    );
  }

  return (
    <div className="w-full select-none">
      {/* Заголовок */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Каталог автомобилей
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Выберите автомобиль и узнайте подробную информацию о модели.
        </p>
      </div>

      {/* Единая плашка фильтрации */}
      <div className="mb-10 rounded-[32px] border border-white/[0.08] bg-[#0c1017]/90 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-7">
        
        {/* Верхняя строка: пресеты цен и поиск */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Пресеты цен */}
          <div className="flex items-center gap-1.5 rounded-2xl border border-white/[0.06] bg-[#06080d]/80 p-1.5 overflow-x-auto shadow-inner">
            <button
              type="button"
              onClick={() => {
                setSelectedPrice("");
                setMinPriceInput("");
                setMaxPriceInput("");
              }}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-300 whitespace-nowrap ${
                selectedPrice === "" && !minPriceInput && !maxPriceInput
                  ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/30 scale-[1.02]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Все
            </button>

            {PRICE_PRESETS.map((price) => (
              <button
                key={price}
                type="button"
                onClick={() => {
                  setSelectedPrice(price);
                  setMinPriceInput("");
                  setMaxPriceInput("");
                }}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-300 whitespace-nowrap ${
                  selectedPrice === price
                    ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/30 scale-[1.02]"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {price}
              </button>
            ))}
          </div>

          {/* Поиск */}
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
              🔍
            </span>
            <input
              type="text"
              placeholder="Поиск модели, марки..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-white/[0.08] bg-[#06080d]/90 py-2.5 pl-11 pr-4 text-xs font-medium text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-sky-500/60 focus:shadow-[0_0_20px_rgba(14,165,233,0.15)]"
            />
          </div>
        </div>

        {/* Разделитель */}
        <div className="my-5 h-px bg-white/[0.05]" />

        {/* Нижняя строка: кастомные дропдауны и ручной ввод цен */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            
            {/* БРЕНДЫ */}
            <div className="relative" ref={brandRef}>
              <button
                type="button"
                onClick={() => {
                  setIsBrandOpen(!isBrandOpen);
                  setIsBodyOpen(false);
                }}
                className={`flex items-center gap-3 rounded-2xl border py-2.5 pl-4 pr-3.5 text-xs font-bold transition-all duration-200 ${
                  isBrandOpen || selectedBrand
                    ? "border-sky-500/50 bg-[#121824] text-white shadow-[0_0_15px_rgba(14,165,233,0.15)]"
                    : "border-white/[0.08] bg-[#06080d]/90 text-slate-300 hover:border-white/20 hover:text-white"
                }`}
              >
                <span>{selectedBrand || "Все бренды"}</span>
                <span className={`text-[10px] text-slate-500 transition-transform duration-200 ${isBrandOpen ? "rotate-180 text-sky-400" : ""}`}>
                  ▼
                </span>
              </button>

              {isBrandOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 max-h-64 w-52 overflow-y-auto rounded-2xl border border-white/10 bg-[#0d131f]/95 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
                  <div
                    onClick={() => {
                      setSelectedBrand("");
                      setIsBrandOpen(false);
                    }}
                    className={`cursor-pointer rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                      selectedBrand === ""
                        ? "bg-sky-500/20 text-sky-400 font-bold"
                        : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    Все бренды
                  </div>
                  {brandsList.map((brand) => (
                    <div
                      key={brand}
                      onClick={() => {
                        setSelectedBrand(brand);
                        setIsBrandOpen(false);
                      }}
                      className={`cursor-pointer rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                        selectedBrand.toLowerCase() === brand.toLowerCase()
                          ? "bg-sky-500/20 text-sky-400 font-bold"
                          : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      {brand}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* КУЗОВА */}
            <div className="relative" ref={bodyRef}>
              <button
                type="button"
                onClick={() => {
                  setIsBodyOpen(!isBodyOpen);
                  setIsBrandOpen(false);
                }}
                className={`flex items-center gap-3 rounded-2xl border py-2.5 pl-4 pr-3.5 text-xs font-bold transition-all duration-200 ${
                  isBodyOpen || selectedBody
                    ? "border-sky-500/50 bg-[#121824] text-white shadow-[0_0_15px_rgba(14,165,233,0.15)]"
                    : "border-white/[0.08] bg-[#06080d]/90 text-slate-300 hover:border-white/20 hover:text-white"
                }`}
              >
                <span className="capitalize">{selectedBody || "Все кузова"}</span>
                <span className={`text-[10px] text-slate-500 transition-transform duration-200 ${isBodyOpen ? "rotate-180 text-sky-400" : ""}`}>
                  ▼
                </span>
              </button>

              {isBodyOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 max-h-64 w-48 overflow-y-auto rounded-2xl border border-white/10 bg-[#0d131f]/95 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
                  <div
                    onClick={() => {
                      setSelectedBody("");
                      setIsBodyOpen(false);
                    }}
                    className={`cursor-pointer rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                      selectedBody === ""
                        ? "bg-sky-500/20 text-sky-400 font-bold"
                        : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    Все кузова
                  </div>
                  {bodiesList.map((body) => (
                    <div
                      key={body}
                      onClick={() => {
                        setSelectedBody(body);
                        setIsBodyOpen(false);
                      }}
                      className={`cursor-pointer rounded-xl px-3 py-2 text-xs font-semibold capitalize transition-all ${
                        selectedBody.toLowerCase() === body.toLowerCase()
                          ? "bg-sky-500/20 text-sky-400 font-bold"
                          : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      {body}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* РУЧНОЙ ВВОД ЦЕН */}
            <div className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#06080d]/90 px-3.5 py-1.5 shadow-inner">
              <span className="text-[11px] font-bold text-slate-500">Цена ₽:</span>

              {/* Поле ОТ */}
              <div className="relative flex flex-col justify-center">
                <input
                  type="text"
                  placeholder="От"
                  value={formatNumberWithSpaces(minPriceInput)}
                  onChange={(e) => {
                    setSelectedPrice("");
                    setMinPriceInput(e.target.value.replace(/\D/g, ""));
                  }}
                  className="w-24 bg-transparent text-xs font-bold text-white placeholder-slate-600 outline-none"
                />
                {minHint && (
                  <span className="absolute -bottom-3.5 left-0 text-[9px] font-semibold text-sky-400/90 whitespace-nowrap">
                    {minHint}
                  </span>
                )}
              </div>

              <span className="text-slate-600 font-bold">—</span>

              {/* Поле ДО */}
              <div className="relative flex flex-col justify-center">
                <input
                  type="text"
                  placeholder="До"
                  value={formatNumberWithSpaces(maxPriceInput)}
                  onChange={(e) => {
                    setSelectedPrice("");
                    setMaxPriceInput(e.target.value.replace(/\D/g, ""));
                  }}
                  className="w-24 bg-transparent text-xs font-bold text-white placeholder-slate-600 outline-none"
                />
                {maxHint && (
                  <span className="absolute -bottom-3.5 left-0 text-[9px] font-semibold text-sky-400/90 whitespace-nowrap">
                    {maxHint}
                  </span>
                )}
              </div>
            </div>

          </div>

          {/* Кнопка сброса */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setSelectedBrand("");
                setSelectedBody("");
                setSelectedPrice("");
                setMinPriceInput("");
                setMaxPriceInput("");
                setSearchTerm("");
              }}
              className="text-xs font-bold text-slate-400 transition-colors hover:text-rose-400"
            >
              Сбросить фильтры ✕
            </button>
          )}
        </div>

      </div>

      {/* Индикатор количества */}
      <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
        <span>Найдено автомобилей: <b className="text-white">{filteredCars.length}</b></span>
      </div>

      {/* Карточки */}
      {filteredCars.length > 0 ? (
        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {filteredCars.map((car) => (
            <CatalogCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-white/10 p-16 text-center text-sm font-medium text-slate-400">
          По заданным параметрам автомобили не найдены. Попробуйте сбросить фильтры.
        </div>
      )}
    </div>
  );
}
