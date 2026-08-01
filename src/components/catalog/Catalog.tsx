import { useEffect, useMemo, useState } from "react";
import { loadCatalog } from "../../services/catalog";
import { Car } from "../../types/car";
import CatalogCard from "./CatalogCard";

export default function Catalog() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [body, setBody] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const data = await loadCatalog();
        setCars(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const brands = [...new Set(cars.map((c) => c.brand.name))];
  const bodies = [...new Set(cars.map((c) => c.body))];
  const priceButtons = [
  { id: "all", label: "Все" },
  { id: "0-2000000", label: "До 2 млн ₽" },
  { id: "2000000-3000000", label: "2–3 млн ₽" },
  { id: "3000000-4000000", label: "3–4 млн ₽" },
  { id: "4000000-5000000", label: "4–5 млн ₽" },
  { id: "5000000+", label: "5+ млн ₽" },
];

  const filtered = useMemo(() => {
    return cars.filter((car) => {
      const searchOk =
        car.model.toLowerCase().includes(search.toLowerCase()) ||
        car.brand.name.toLowerCase().includes(search.toLowerCase());

      const brandOk = !brand || car.brand.name === brand;
const bodyOk = !body || car.body === body;

let priceOk = true;

switch (priceFilter) {
  case "0-2000000":
    priceOk = car.priceFrom < 2000000;
    break;

  case "2000000-3000000":
    priceOk =
      car.priceFrom >= 2000000 &&
      car.priceFrom < 3000000;
    break;

  case "3000000-4000000":
    priceOk =
      car.priceFrom >= 3000000 &&
      car.priceFrom < 4000000;
    break;

  case "4000000-5000000":
    priceOk =
      car.priceFrom >= 4000000 &&
      car.priceFrom < 5000000;
    break;

  case "5000000+":
    priceOk = car.priceFrom >= 5000000;
    break;
}

return searchOk && brandOk && bodyOk && priceOk;
    });
  }, [cars, search, brand, body, priceFilter]);

  if (loading) {
    return (
      <div className="py-20 text-center text-xl">
        Загрузка каталога...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div className="flex flex-wrap gap-4">
        <div className="flex flex-wrap gap-3">

  {priceButtons.map((item) => (

    <button
      key={item.id}
      onClick={() => setPriceFilter(item.id)}
      className={`
        rounded-xl
        px-5
        py-3
        font-semibold
        transition
        ${
          priceFilter === item.id
            ? "bg-blue-600 text-white"
            : "bg-white dark:bg-slate-900 border hover:bg-slate-100 dark:hover:bg-slate-800"
        }
      `}
    >
      {item.label}
    </button>

  ))}

</div>

        <input
          className="flex-1 rounded-xl border p-3"
          placeholder="Поиск..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="rounded-xl border p-3"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        >
          <option value="">Все бренды</option>

          {brands.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}

        </select>

        <select
          className="rounded-xl border p-3"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        >
          <option value="">Все кузова</option>

          {bodies.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}

        </select>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {filtered.map((car) => (
          <CatalogCard
            key={car.id}
            car={car}
          />
        ))}

      </div>

    </div>
  );
}
