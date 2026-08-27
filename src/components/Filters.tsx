import { useState, useRef, useEffect } from "react";

interface Props {
  brands: string[];
  bodies: string[];
  prices: string[];

  selectedBrand: string;
  selectedBody: string;
  selectedPrice: string;

  minPriceInput?: string;
  maxPriceInput?: string;

  onBrandChange: (v: string) => void;
  onBodyChange: (v: string) => void;
  onPriceChange: (v: string) => void;

  onMinPriceChange?: (v: string) => void;
  onMaxPriceChange?: (v: string) => void;

  searchTerm?: string;
  onSearchChange?: (v: string) => void;
}

// Форматирование числа с пробелами: "2500000" -> "2 500 000"
function formatNumberWithSpaces(val: string): string {
  const digitsOnly = val.replace(/\D/g, "");
  if (!digitsOnly) return "";
  return Number(digitsOnly).toLocaleString("ru-RU");
}

// Компактная подсказка: 3500000 -> "3.5 млн ₽"
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

export default function Filters(props: Props) {
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isBodyOpen, setIsBodyOpen] = useState(false);

  const brandRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Закрытие дропдаунов при клике вне компонента
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

  const hasActiveFilters = Boolean(
    props.selectedBrand ||
    props.selectedBody ||
    props.selectedPrice ||
    props.minPriceInput ||
    props.maxPriceInput ||
    props.searchTerm
  );

  const minHint = getReadablePriceHint(props.minPriceInput || "");
  const maxHint = getReadablePriceHint(props.maxPriceInput || "");

  return (
    <div className="mb-10 w-full select-none">
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
      <div className="rounded-[32px] border border-white/[0.08] bg-[#0c1017]/90 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-7">
        
        {/* Верхняя строка: пресеты цен и поиск */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Кнопки пресетов цен */}
          <div className="flex items-center gap-1.5 rounded-2xl border border-white/[0.06] bg-[#06080d]/80 p-1.5 overflow-x-auto shadow-inner">
            <button
              type="button"
              onClick={() => {
                props.onPriceChange("");
                props.onMinPriceChange?.("");
                props.onMaxPriceChange?.("");
              }}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-300 whitespace-nowrap ${
                props.selectedPrice === "" && !props.minPriceInput && !props.maxPriceInput
                  ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/30 scale-[1.02]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Все
            </button>

            {props.prices.map((price) => (
              <button
                key={price}
                type="button"
                onClick={() => {
                  props.onPriceChange(price);
                  props.onMinPriceChange?.("");
                  props.onMaxPriceChange?.("");
                }}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-300 whitespace-nowrap ${
                  props.selectedPrice === price
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
              value={props.searchTerm || ""}
              onChange={(e) => props.onSearchChange?.(e.target.value)}
              className="w-full rounded-2xl border border-white/[0.08] bg-[#06080d]/90 py-2.5 pl-11 pr-4 text-xs font-medium text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-sky-500/60 focus:shadow-[0_0_20px_rgba(14,165,233,0.15)]"
            />
          </div>
        </div>

        {/* Разделитель */}
        <div className="my-5 h-px bg-white/[0.05]" />

        {/* Нижняя строка: кастомные дропдауны и ввод цен */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            
            {/* КАСТОМНЫЙ ДРОПДАУН: БРЕНДЫ */}
            <div className="relative" ref={brandRef}>
              <button
                type="button"
                onClick={() => {
                  setIsBrandOpen(!isBrandOpen);
                  setIsBodyOpen(false);
                }}
                className={`flex items-center gap-3 rounded-2xl border py-2.5 pl-4 pr-3.5 text-xs font-bold transition-all duration-200 ${
                  isBrandOpen || props.selectedBrand
                    ? "border-sky-500/50 bg-[#121824] text-white shadow-[0_0_15px_rgba(14,165,233,0.15)]"
                    : "border-white/[0.08] bg-[#06080d]/90 text-slate-300 hover:border-white/20 hover:text-white"
                }`}
              >
                <span>{props.selectedBrand || "Все бренды"}</span>
                <span className={`text-[10px] text-slate-500 transition-transform duration-200 ${isBrandOpen ? "rotate-180 text-sky-400" : ""}`}>
                  ▼
                </span>
              </button>

              {isBrandOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 max-h-64 w-52 overflow-y-auto rounded-2xl border border-white/10 bg-[#0d131f]/95 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl scrollbar-thin scrollbar-thumb-white/10">
                  <div
                    onClick={() => {
                      props.onBrandChange("");
                      setIsBrandOpen(false);
                    }}
                    className={`cursor-pointer rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                      props.selectedBrand === ""
                        ? "bg-sky-500/20 text-sky-400 font-bold"
                        : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    Все бренды
                  </div>
                  {props.brands.map((brand) => (
                    <div
                      key={brand}
                      onClick={() => {
                        props.onBrandChange(brand);
                        setIsBrandOpen(false);
                      }}
                      className={`cursor-pointer rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                        props.selectedBrand.toLowerCase() === brand.toLowerCase()
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

            {/* КАСТОМНЫЙ ДРОПДАУН: КУЗОВА */}
            <div className="relative" ref={bodyRef}>
              <button
                type="button"
                onClick={() => {
                  setIsBodyOpen(!isBodyOpen);
                  setIsBrandOpen(false);
                }}
                className={`flex items-center gap-3 rounded-2xl border py-2.5 pl-4 pr-3.5 text-xs font-bold transition-all duration-200 ${
                  isBodyOpen || props.selectedBody
                    ? "border-sky-500/50 bg-[#121824] text-white shadow-[0_0_15px_rgba(14,165,233,0.15)]"
                    : "border-white/[0.08] bg-[#06080d]/90 text-slate-300 hover:border-white/20 hover:text-white"
                }`}
              >
                <span className="capitalize">{props.selectedBody || "Все кузова"}</span>
                <span className={`text-[10px] text-slate-500 transition-transform duration-200 ${isBodyOpen ? "rotate-180 text-sky-400" : ""}`}>
                  ▼
                </span>
              </button>

              {isBodyOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 max-h-64 w-48 overflow-y-auto rounded-2xl border border-white/10 bg-[#0d131f]/95 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
                  <div
                    onClick={() => {
                      props.onBodyChange("");
                      setIsBodyOpen(false);
                    }}
                    className={`cursor-pointer rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                      props.selectedBody === ""
                        ? "bg-sky-500/20 text-sky-400 font-bold"
                        : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    Все кузова
                  </div>
                  {props.bodies.map((body) => (
                    <div
                      key={body}
                      onClick={() => {
                        props.onBodyChange(body);
                        setIsBodyOpen(false);
                      }}
                      className={`cursor-pointer rounded-xl px-3 py-2 text-xs font-semibold capitalize transition-all ${
                        props.selectedBody.toLowerCase() === body.toLowerCase()
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

            {/* ДИАПАЗОН ЦЕН С ГРАДАЦИЕЙ */}
            <div className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#06080d]/90 px-3.5 py-1.5 shadow-inner">
              <span className="text-[11px] font-bold text-slate-500">Цена ₽:</span>

              {/* Поле ОТ */}
              <div className="relative flex flex-col justify-center">
                <input
                  type="text"
                  placeholder="От"
                  value={formatNumberWithSpaces(props.minPriceInput || "")}
                  onChange={(e) => {
                    const rawDigits = e.target.value.replace(/\D/g, "");
                    props.onPriceChange("");
                    props.onMinPriceChange?.(rawDigits);
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
                  value={formatNumberWithSpaces(props.maxPriceInput || "")}
                  onChange={(e) => {
                    const rawDigits = e.target.value.replace(/\D/g, "");
                    props.onPriceChange("");
                    props.onMaxPriceChange?.(rawDigits);
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
                props.onBrandChange("");
                props.onBodyChange("");
                props.onPriceChange("");
                props.onMinPriceChange?.("");
                props.onMaxPriceChange?.("");
                props.onSearchChange?.("");
              }}
              className="text-xs font-bold text-slate-400 transition-colors hover:text-rose-400"
            >
              Сбросить фильтры ✕
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
