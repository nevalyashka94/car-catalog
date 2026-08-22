interface Props {
  brands: string[];
  bodies: string[];
  prices: string[];

  selectedBrand: string;
  selectedBody: string;
  selectedPrice: string;

  onBrandChange: (v: string) => void;
  onBodyChange: (v: string) => void;
  onPriceChange: (v: string) => void;

  searchTerm?: string;
  onSearchChange?: (v: string) => void;
}

export default function Filters(props: Props) {
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
          
          {/* Цельная темная капсула с кнопками цен */}
          <div className="flex items-center gap-1 rounded-2xl border border-white/[0.05] bg-[#06080d] p-1.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => props.onPriceChange("")}
              className={`rounded-xl px-5 py-2.5 text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                props.selectedPrice === ""
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
                onClick={() => props.onPriceChange(price)}
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
        <div className="mt-4 border-t border-white/[0.04] pt-4 flex items-center justify-between">
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

          {(props.selectedBrand || props.selectedBody || props.selectedPrice) && (
            <button
              type="button"
              onClick={() => {
                props.onBrandChange("");
                props.onBodyChange("");
                props.onPriceChange("");
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
