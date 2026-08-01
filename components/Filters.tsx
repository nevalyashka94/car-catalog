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

function Group({
  title,
  values,
  selected,
  onChange,
}: GroupProps) {
  return (
    <section
      className="
        rounded-2xl
        border
        border-slate-200
        dark:border-slate-700
        bg-white
        dark:bg-slate-900
        p-5
        shadow-sm
      "
    >
      <h3 className="text-lg font-semibold mb-4">
        {title}
      </h3>

      <div className="flex flex-wrap gap-3">

        <button
          onClick={() => onChange("")}
          className={`
            rounded-full
            px-4
            py-2
            transition
            border
            ${
              selected === ""
                ? "bg-blue-600 text-white border-blue-600"
                : "hover:bg-slate-100 dark:hover:bg-slate-800"
            }
          `}
        >
          Все
        </button>

        {values.map((item) => (
          <button
            key={item}
            onClick={() => onChange(item)}
            className={`
              rounded-full
              px-4
              py-2
              transition
              border
              ${
                selected === item
                  ? "bg-blue-600 text-white border-blue-600"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }
            `}
          >
            {item}
          </button>
        ))}

      </div>
    </section>
  );
}

export default function Filters(props: Props) {
  return (
    <div className="space-y-5">

      <Group
        title="🚘 Бренд"
        values={props.brands}
        selected={props.selectedBrand}
        onChange={props.onBrandChange}
      />

      <Group
        title="🚗 Кузов"
        values={props.bodies}
        selected={props.selectedBody}
        onChange={props.onBodyChange}
      />

      <Group
        title="💰 Цена"
        values={props.prices}
        selected={props.selectedPrice}
        onChange={props.onPriceChange}
      />

    </div>
  );
}