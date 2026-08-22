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
}

interface GroupProps {
  title: string;
  values: string[];
  selected: string;
  onChange: (value: string) => void;
}

function FilterGroup({
  title,
  values,
  selected,
  onChange,
}: GroupProps) {
  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
          {title}
        </h3>

        {selected && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="
              text-xs
              font-bold
              text-blue-500
              transition-colors
              hover:text-blue-600
              dark:text-sky-400
              dark:hover:text-sky-300
            "
          >
            Сбросить
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Все */}
        <button
          type="button"
          onClick={() => onChange("")}
          className={`
            rounded-2xl
            border
            px-4
            py-2
            text-xs
            font-bold
            transition-all
            duration-200
            ${
              selected === ""
                ? `
                  border-blue-600
                  bg-gradient-to-r
                  from-blue-600
                  to-sky-500
                  text-white
                  shadow-md
                  shadow-blue-500/30
                `
                : `
                  border-slate-200/80
                  bg-white/60
                  text-slate-600
                  hover:border-slate-300
                  hover:bg-slate-100
                  dark:border-white/[0.08]
                  dark:bg-white/[0.03]
                  dark:text-slate-300
                  dark:hover:border-white/20
                  dark:hover:bg-white/[0.08]
                `
            }
          `}
        >
          Все
        </button>

        {values.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={`
              rounded-2xl
              border
              px-4
              py-2
              text-xs
              font-bold
              transition-all
              duration-200
              ${
                selected === item
                  ? `
                    border-blue-600
                    bg-gradient-to-r
                    from-blue-600
                    to-sky-500
                    text-white
                    shadow-md
                    shadow-blue-500/30
                  `
                  : `
                    border-slate-200/80
                    bg-white/60
                    text-slate-600
                    hover:border-slate-300
                    hover:bg-slate-100
                    dark:border-white/[0.08]
                    dark:bg-white/[0.03]
                    dark:text-slate-300
                    dark:hover:border-white/20
                    dark:hover:bg-white/[0.08]
                  `
              }
            `}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Filters(props: Props) {
  return (
    <div
      className="
        rounded-[30px]
        border
        border-slate-200/80
        bg-white/70
        p-6
        shadow-lg
        shadow-slate-200/50
        backdrop-blur-2xl
        dark:border-white/[0.08]
        dark:bg-[#0e1118]/70
        dark:shadow-2xl
        dark:shadow-black/50
        sm:p-8
      "
    >
      {/* Заголовок фильтров */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <div className="font-['Space_Grotesk',sans-serif] text-xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            Фильтры
          </div>
          <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Настройте точные параметры подбора
          </div>
        </div>

        {(props.selectedBrand ||
          props.selectedBody ||
          props.selectedPrice) && (
          <button
            type="button"
            onClick={() => {
              props.onBrandChange("");
              props.onBodyChange("");
              props.onPriceChange("");
            }}
            className="
              rounded-xl
              border
              border-slate-200
              px-3
              py-1.5
              text-xs
              font-bold
              text-slate-500
              transition-all
              hover:border-slate-300
              hover:bg-slate-100
              hover:text-slate-900
              dark:border-white/10
              dark:text-slate-400
              dark:hover:bg-white/10
              dark:hover:text-white
            "
          >
            Сбросить всё
          </button>
        )}
      </div>

      {/* Список групп */}
      <div className="space-y-6">
        <FilterGroup
          title="Бренд"
          values={props.brands}
          selected={props.selectedBrand}
          onChange={props.onBrandChange}
        />

        <div className="border-t border-slate-100 dark:border-white/[0.06]" />

        <FilterGroup
          title="Кузов"
          values={props.bodies}
          selected={props.selectedBody}
          onChange={props.onBodyChange}
        />

        <div className="border-t border-slate-100 dark:border-white/[0.06]" />

        <FilterGroup
          title="Цена"
          values={props.prices}
          selected={props.selectedPrice}
          onChange={props.onPriceChange}
        />
      </div>
    </div>
  );
}
