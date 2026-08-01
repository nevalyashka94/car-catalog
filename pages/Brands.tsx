import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBrands } from "../services/catalog";

type Brand = {
  id: number;
  name: string;
};

export default function Brands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getBrands();
        setBrands(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-xl">
        Загрузка брендов...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10">

      <h1 className="text-4xl font-bold mb-8">
        Бренды автомобилей
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {brands.map((brand) => (

          <Link
            key={brand.id}
            to={`/brands/${brand.id}`}
            className="
              rounded-2xl
              border
              p-8
              bg-white
              dark:bg-slate-900
              hover:shadow-xl
              transition
            "
          >
            <div className="text-2xl font-bold">
              {brand.name}
            </div>

          </Link>

        ))}

      </div>

    </div>
  );
}