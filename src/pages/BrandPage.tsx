import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { loadCatalog } from "../services/catalog";
import { Car } from "../types/car";

export default function BrandPage() {
  const { id } = useParams();

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await loadCatalog();

        setCars(
          data.filter((car) => String(car.brand.id) === id)
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        Загрузка...
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="py-20 text-center">
        Автомобили не найдены
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10">

      <h1 className="text-4xl font-bold mb-8">
        {cars[0].brand.name}
      </h1>

      <div className="space-y-4">

        {cars.map((car) => (

          <Link
            key={car.id}
            to={`/cars/${car.id}`}
            className="
              flex
              justify-between
              items-center
              rounded-2xl
              border
              bg-white
              dark:bg-slate-900
              p-6
              hover:shadow-lg
              transition
            "
          >

            <div>

              <div className="text-2xl font-bold">
                {car.model}
              </div>

              <div className="text-slate-500 mt-2">
                {car.body}
              </div>

            </div>

            <div className="text-2xl font-bold">

              от {car.priceFrom.toLocaleString()} ₽

            </div>

          </Link>

        ))}

      </div>

    </div>
  );
}