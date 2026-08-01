import { useEffect, useState } from "react";
import { getDealersForCar } from "../services/carDealerView";

interface Car {
  id: number;
  brand: string;
  model: string;
  body: string;
  priceText: string;
  priceFrom: number;
  priceTo: number;
}

interface Dealer {
  id: number;
  name: string;
}

interface Props {
  car: Car;
}

export default function CarCard({ car }: Props) {
  const [open, setOpen] = useState(false);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    async function loadDealers() {
      try {
        setLoading(true);

        const data = await getDealersForCar(car.id);

        setDealers(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadDealers();
  }, [open, car.id]);

  return (
    <div
      className="
        group
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        dark:border-slate-700
        bg-white
        dark:bg-slate-900
        shadow-sm
        hover:shadow-2xl
        transition-all
        duration-300
        hover:-translate-y-1
      "
    >
      <div
        className="
          h-56
          bg-gradient-to-br
          from-slate-100
          to-slate-200
          dark:from-slate-800
          dark:to-slate-700
          flex
          items-center
          justify-center
          text-7xl
        "
      >
        🚗
      </div>

      <div className="p-6">

        <div className="flex justify-between items-start">

          <div>

            <div className="text-2xl font-bold">
              {car.brand}
            </div>

            <div className="mt-1 text-slate-500">
              {car.model}
            </div>

          </div>

          <span
            className="
              rounded-full
              bg-blue-100
              dark:bg-blue-900
              text-blue-700
              dark:text-blue-300
              px-3
              py-1
              text-sm
            "
          >
            {car.body}
          </span>

        </div>

        <div className="mt-8">

          <div className="text-sm text-slate-500">
            Стоимость
          </div>

          <div className="text-2xl font-bold text-blue-600 mt-1">
            {car.priceText}
          </div>

        </div>

        <button
          onClick={() => setOpen(!open)}
          className="
            mt-6
            w-full
            rounded-xl
            bg-blue-600
            hover:bg-blue-700
            text-white
            py-3
            transition
          "
        >
          {open ? "Скрыть дилеров" : "Подробнее"}
        </button>

        {open && (

          <div
            className="
              mt-5
              rounded-2xl
              bg-slate-100
              dark:bg-slate-800
              p-4
            "
          >

            <h3 className="font-semibold mb-3">
              Официальные дилеры
            </h3>

            {loading ? (

              <div>Загрузка...</div>

            ) : dealers.length > 0 ? (

              <div className="space-y-2">

                {dealers.map((dealer) => (

                  <div
                    key={dealer.id}
                    className="
                      rounded-xl
                      bg-white
                      dark:bg-slate-900
                      px-4
                      py-3
                      border
                      border-slate-200
                      dark:border-slate-700
                    "
                  >
                    🏢 {dealer.name}
                  </div>

                ))}

              </div>

            ) : (

              <div className="text-slate-500">
                Для этого автомобиля дилеры не выбраны.
              </div>

            )}

          </div>

        )}

      </div>

    </div>
  );
}