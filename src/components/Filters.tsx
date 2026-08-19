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
    <div className="space-y-3">

      <div
        className="
          flex
          items-center
          justify-between
        "
      >
        <h3
          className="
            text-sm
            font-bold
            text-slate-900
            dark:text-white
          "
        >
          {title}
        </h3>

        {selected && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="
              text-xs
              font-semibold
              text-blue-600
              transition
              hover:text-blue-700
              dark:text-blue-400
              dark:hover:text-blue-300
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
            rounded-xl
            border
            px-3.5
            py-2
            text-sm
            font-semibold
            transition-all
            ${
              selected === ""
                ? `
                  border-blue-600
                  bg-blue-600
                  text-white
                  shadow-sm
                  shadow-blue-600/20
                `
                : `
                  border-slate-200
                  bg-white
                  text-slate-600
                  hover:border-slate-300
                  hover:bg-slate-50
                  dark:border-slate-700
                  dark:bg-slate-900
                  dark:text-slate-300
                  dark:hover:border-slate-600
                  dark:hover:bg-slate-800
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
              rounded-xl
              border
              px-3.5
              py-2
              text-sm
              font-semibold
              transition-all
              ${
                selected === item
                  ? `
                    border-blue-600
                    bg-blue-600
                    text-white
                    shadow-sm
                    shadow-blue-600/20
                  `
                  : `
                    border-slate-200
                    bg-white
                    text-slate-600
                    hover:border-blue-200
                    hover:bg-blue-50
                    hover:text-blue-700
                    dark:border-slate-700
                    dark:bg-slate-900
                    dark:text-slate-300
                    dark:hover:border-blue-900
                    dark:hover:bg-blue-950/30
                    dark:hover:text-blue-300
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
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
        sm:p-6
      "
    >

      {/* Верхняя часть */}
      <div
        className="
          mb-5
          flex
          items-center
          justify-between
          gap-4
        "
      >
        <div>
          <div
            className="
              text-base
              font-extrabold
              text-slate-950
              dark:text-white
            "
          >
            Фильтры
          </div>

          <div
            className="
              mt-1
              text-xs
              text-slate-500
              dark:text-slate-400
            "
          >
            Настройте параметры автомобиля
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
              px-3
              py-2
              text-xs
              font-bold
              text-slate-500
              transition
              hover:bg-slate-100
              hover:text-slate-900
              dark:text-slate-400
              dark:hover:bg-slate-800
              dark:hover:text-white
            "
          >
            Сбросить всё
          </button>
        )}
      </div>

      {/* Фильтры */}
      <div className="space-y-6">

        <FilterGroup
          title="Бренд"
          values={props.brands}
          selected={props.selectedBrand}
          onChange={props.onBrandChange}
        />

        <div className="border-t border-slate-100 dark:border-slate-800" />

        <FilterGroup
          title="Кузов"
          values={props.bodies}
          selected={props.selectedBody}
          onChange={props.onBodyChange}
        />

        <div className="border-t border-slate-100 dark:border-slate-800" />

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
