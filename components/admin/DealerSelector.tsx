import { useEffect, useMemo, useState } from "react";
import { getDealers } from "../../services/dealerSelector";

type Dealer = {
  id: number;
  name: string;
  dealer_group: string;
};

interface Props {
  selected: number[];
  onChange: (ids: number[]) => void;
}

export default function DealerSelector({
  selected,
  onChange,
}: Props) {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      const data = await getDealers();
      setDealers(data);
    }

    load();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return dealers;

    return dealers.filter(
      (dealer) =>
        dealer.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        dealer.dealer_group
          ?.toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [dealers, search]);

  function toggle(id: number) {
    if (selected.includes(id)) {
      onChange(selected.filter((item) => item !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  return (
    <div className="space-y-4">

      <input
        className="
          w-full
          rounded-xl
          border
          p-3
        "
        placeholder="Поиск дилера..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div
        className="
          max-h-[500px]
          overflow-y-auto
          rounded-xl
          border
        "
      >
        {filtered.map((dealer) => (
          <label
            key={dealer.id}
            className="
              flex
              items-center
              gap-3
              px-4
              py-3
              border-b
              cursor-pointer
              hover:bg-slate-100
              dark:hover:bg-slate-800
            "
          >
            <input
              type="checkbox"
              checked={selected.includes(dealer.id)}
              onChange={() => toggle(dealer.id)}
            />

            <div>

              <div className="font-medium">
                {dealer.name}
              </div>

              <div className="text-xs text-slate-500">
                {dealer.dealer_group}
              </div>

            </div>

          </label>
        ))}
      </div>

      <div className="text-sm text-slate-500">
        Выбрано дилеров: {selected.length}
      </div>

    </div>
  );
}