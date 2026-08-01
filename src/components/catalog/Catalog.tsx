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

  const filtered = useMemo(() => {
    return cars.filter((car) => {
      const searchOk =
        car.model.toLowerCase().includes(search.toLowerCase()) ||
        car.brand.name.toLowerCase().includes(search.toLowerCase());

      const brandOk = !brand || car.brand.name === brand;
      const bodyOk = !body || car.body === body;

      return searchOk && brandOk && bodyOk;
    });
  }, [cars, search, brand, body]);

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