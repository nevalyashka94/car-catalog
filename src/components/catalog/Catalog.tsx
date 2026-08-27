import { useState, useMemo, useEffect } from "react";
import { Car } from "../../types/car";
import { loadCatalog } from "../../services/catalog";
import CatalogCard from "./CatalogCard";
import { CatalogFilterState } from "../ai/CatAssistant";

interface CatalogProps {
  initialFilters?: CatalogFilterState;
}

export default function Catalog({ initialFilters }: CatalogProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // Состояния фильтров
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedBody, setSelectedBody] = useState<string>("all");
  const [selectedPricePreset, setSelectedPricePreset] = useState<string>("all");
  const [minPriceInput, setMinPriceInput] = useState<string>("");
  const [maxPriceInput, setMaxPriceInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    loadCatalog()
      .then((data) => setCars(data))
      .finally(() => setLoading(false));
  }, []);

  // Синхронизация фильтров от кота
  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.brand) setSelectedBrand(initialFilters.brand.toLowerCase());
      if (initialFilters.body) setSelectedBody(initialFilters.body.toLowerCase());
      if (initialFilters.searchQuery) setSearchQuery(initialFilters.searchQuery);

      if (initialFilters.minPrice) setMinPriceInput(String(initialFilters.minPrice));
      if (initialFilters.maxPrice) setMaxPriceInput(String(initialFilters.maxPrice));
      setSelectedPricePreset("custom");
    }
  }, [initialFilters]);

  // Уникальные бренды и кузова
  const brandsList = useMemo(() => {
    const list = Array.from(new Set(cars.map((c) => c.brand?.name).filter(Boolean))) as string[];
    return list.sort();
  }, [cars]);

  const bodiesList = useMemo(() => {
    const list = Array.from(new Set(cars.map((c) => c.body).filter(Boolean))) as string[];
    return list.sort();
  }, [cars]);

  // Обработка пресетов цен
  const handlePricePreset = (preset: string) => {
    setSelectedPricePreset(preset);
    if (preset === "all") {
      setMinPriceInput("");
      setMaxPriceInput("");
    } else if (preset === "under2") {
      setMinPriceInput("");
      setMaxPriceInput("2000000");
    } else if (preset === "2to3") {
      setMinPriceInput("2000000");
      setMaxPriceInput("3000000");
    } else if (preset === "3to4") {
      setMinPriceInput("3000000");
      setMaxPriceInput("4000000");
    } else if (preset === "4to5") {
      setMinPriceInput("4000000");
      setMaxPriceInput("5000000");
    } else if (preset === "over5") {
      setMinPriceInput("5000000");
      setMaxPriceInput("");
    }
  };

  const handleResetFilters = () => {
    setSelectedBrand("all");
    setSelectedBody("all");
    setSelectedPricePreset("all");
    setMinPriceInput("");
    setMaxPriceInput("");
    setSearchQuery("");
  };

  // Фильтрация каталога
  const filteredCars = useMemo(() => {
    const minVal = minPriceInput ? parseFloat(minPriceInput) : null;
    const maxVal = maxPriceInput ? parseFloat(maxPriceInput) : null;

    return cars.filter((car) => {
      // 1. Поиск по тексту
      if (searchQuery.trim()) {
        const full = `${car.brand?.name || ""} ${car.model || ""}`.toLowerCase();
        if (!full.includes(searchQuery.toLowerCase().trim())) return false;
      }

      // 2. Бренд
      if (selectedBrand !== "all") {
        const bName = car.brand?.name?.toLowerCase() || "";
        if (!bName.includes(selectedBrand)) return false;
      }

      // 3. Кузов
      if (selectedBody !== "all") {
        const bBody = car.body?.toLowerCase() || "";
        if (!bBody.includes(selectedBody)) return false;
      }

      // 4. Диапазон цен
      const carPrice = car.priceFrom || car.priceTo || 0;
      if (carPrice > 0) {
        if (minVal !== null && carPrice < minVal) return false;
        if (maxVal !== null && carPrice > maxVal) return false;
      }

      return true;
    });
  }, [cars, searchQuery, selectedBrand, selectedBody, minPriceInput, maxPriceInput]);

  if (loading) {
    return (
      <div className="py-24 text-center font-bold text-slate-500 dark:text-slate-400">
        Загрузка автомобилей...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ПАНЕЛЬ ФИЛЬТРОВ */}
      <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-xl backdrop-blur-2xl dark:border-white/[0.08] dark:bg-[#0c1017]/90 sm:p-8">
        <div className="flex flex-col gap-6">
          {/* Верхняя строка: пресеты цен и поиск */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-slate-100 p-1.5 dark:bg-white/[0.04]">
              {[
                { id: "all", label: "Все" },
                { id: "under2", label: "До 2 млн ₽" },
                { id: "2to3", label: "2–3 млн ₽" },
                { id: "3to4", label: "3–4 млн ₽" },
                { id: "4to5", label: "4–5 млн ₽" },
                { id: "over5", label: "5+ млн ₽" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePricePreset(p.id)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                    selectedPricePreset === p.id
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Поиск */}
            <div className="relative min-w-[240px] flex-1 max-w-md">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Поиск модели, марки..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 dark:border-white/[0.08] dark:bg-[#06080d] dark:text-white"
              />
            </div>
          </div>

          <div className="h-px bg-slate-200/70 dark:bg-white/[0.06]" />

          {/* Нижняя строка: селекты и ручной ввод цен */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Селект брендов */}
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 outline-none transition focus:border-blue-500 dark:border-white/[0.08] dark:bg-[#06080d] dark:text-white"
              >
                <option value="all">Все бренды</option>
                {brandsList.map((b) => (
                  <option key={b} value={b.toLowerCase()}>
                    {b}
                  </option>
                ))}
              </select>

              {/* Селект кузова */}
              <select
                value={selectedBody}
                onChange={(e) => setSelectedBody(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 outline-none transition focus:border-blue-500 dark:border-white/[0.08] dark:bg-[#06080d] dark:text-white"
              >
                <option value="all">Все кузова</option>
                {bodiesList.map((body) => (
                  <option key={body} value={body.toLowerCase()}>
                    {body}
                  </option>
                ))}
              </select>

              {/* Ручной ввод цен */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Цена ₽:</span>
                <input
                  type="number"
                  placeholder="От"
                  value={minPriceInput}
                  onChange={(e) => {
                    setMinPriceInput(e.target.value);
                    setSelectedPricePreset("custom");
                  }}
                  className="w-28 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 dark:border-white/[0.08] dark:bg-[#06080d] dark:text-white"
                />
                <span className="text-slate-400">–</span>
                <input
                  type="number"
                  placeholder="До"
                  value={maxPriceInput}
                  onChange={(e) => {
                    setMaxPriceInput(e.target.value);
                    setSelectedPricePreset("custom");
                  }}
                  className="w-28 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 dark:border-white/[0.08] dark:bg-[#06080d] dark:text-white"
                />
              </div>
            </div>

            {/* Сброс */}
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-slate-400 transition hover:text-blue-500 dark:hover:text-sky-400"
            >
              Сбросить фильтры
            </button>
          </div>
        </div>
      </div>

      {/* РЕЗУЛЬТАТЫ КАТАЛОГА */}
      <div>
        <div className="mb-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Найдено автомобилей: <b className="text-slate-900 dark:text-white">{filteredCars.length}</b></span>
        </div>

        {filteredCars.length > 0 ? (
          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {filteredCars.map((car) => (
              <CatalogCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 p-16 text-center text-sm font-medium text-slate-500 dark:border-white/10 dark:text-slate-400">
            По заданным фильтрам автомобили не найдены. Попробуйте изменить параметры или сбросить фильтры.
          </div>
        )}
      </div>
    </div>
  );
}
