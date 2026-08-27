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

export default function Filters(props: Props) {
  const hasActiveFilters = Boolean(
    props.selectedBrand ||
    props.selectedBody ||
    props.selectedPrice ||
    props.minPriceInput ||
    props.maxPriceInput ||
    props.searchTerm
  );

  return (
    <div className="mb-10 w-full">
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
      <div className="rounded-[28px] border border-white/[0.06] bg-[#0c1017]/80 p-5 backdrop-blur-xl sm:p-6">
        
        {/* Верхняя строка */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Кнопки пресетов цен */}
          <div className="flex items-center gap-1 rounded-2xl border border-white/[0.05] bg-[#06080d] p-1.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => {
                props.onPriceChange("");
                props.onMinPriceChange?.("");
                props.onMaxPriceChange?.("");
              }}
              className={`rounded-xl px-5 py-2.5 text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                props.selectedPrice === "" && !props.minPriceInput && !props.maxPriceInput
                  ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/30"
                  : "text-slate-400 hover:text-white"
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
                className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                  props.selectedPrice === price
                    ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {price}
              </button>
            ))}
          </div>

          {/* Правая часть: Поиск + Селект брендов */}
          <div className="flex flex-1 items-center justify-end gap-3 min-w-[280px]">
            {/* Поиск */}
            <div className="relative flex-1 max-w-sm">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                🔍
              </span>
              <input
                type="text"
                placeholder="Поиск модели, марки..."
                value={props.searchTerm || ""}
                onChange={(e) => props.onSearchChange?.(e.target.value)}
                className="w-full rounded-2xl border border-white/[0.05] bg-[#06080d] py-3 pl-11 pr-4 text-xs text-white placeholder-slate-500 outline-none transition-all focus:border-sky-500/50"
              />
            </div>

            {/* Все бренды */}
            <div className="relative">
              <select
                value={props.selectedBrand}
                onChange={(e) => props.onBrandChange(e.target.value)}
                className="cursor-pointer appearance-none rounded-2xl border border-white/[0.05] bg-[#06080d] py-3 pl-5 pr-10 text-xs font-semibold text-slate-300 outline-none transition-all hover:border-white/10 focus:border-sky-500/50"
              >
                <option value="" className="bg-[#06080d] text-white">Все бренды</option>
                {props.brands.map((brand) => (
                  <option key={brand} value={brand} className="bg-[#06080d] text-white">
                    {brand}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-500">
                ▼
              </span>
            </div>
          </div>
        </div>

        {/* Разделитель и нижняя строка */}
        <div className="mt-4 border-t border-white/[0.04] pt-4 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Селект кузовов */}
            <div className="relative">
              <select
                value={props.selectedBody}
                onChange={(e) => props.onBodyChange(e.target.value)}
                className="cursor-pointer appearance-none rounded-2xl border border-white/[0.05] bg-[#06080d] py-2.5 pl-5 pr-10 text-xs font-semibold text-slate-300 outline-none transition-all hover:border-white/10 focus:border-sky-500/50"
              >
                <option value="" className="bg-[#06080d] text-white">Все кузова</option>
                {props.bodies.map((body) => (
                  <option key={body} value={body} className="bg-[#06080d] text-white">
                    {body}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-500">
                ▼
              </span>
            </div>

            {/* Ручной ввод диапазона цены */}
            <div className="flex items-center gap-2 rounded-2xl border border-white/[0.05] bg-[#06080d] px-3.5 py-1.5">
              <span className="text-[11px] font-semibold text-slate-400">Цена ₽:</span>
              <input
                type="number"
                placeholder="От"
                value={props.minPriceInput || ""}
                onChange={(e) => {
                  props.onPriceChange("");
                  props.onMinPriceChange?.(e.target.value);
                }}
                className="w-24 bg-transparent text-xs font-medium text-white placeholder-slate-600 outline-none"
              />
              <span className="text-slate-600">—</span>
              <input
                type="number"
                placeholder="До"
                value={props.maxPriceInput || ""}
                onChange={(e) => {
                  props.onPriceChange("");
                  props.onMaxPriceChange?.(e.target.value);
                }}
                className="w-24 bg-transparent text-xs font-medium text-white placeholder-slate-600 outline-none"
              />
            </div>
          </div>

          {/* Кнопка сброса фильтров */}
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
              className="text-xs font-semibold text-slate-400 transition hover:text-white"
            >
              Сбросить фильтры
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
