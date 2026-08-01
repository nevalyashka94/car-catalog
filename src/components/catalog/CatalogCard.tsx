import { useState } from "react";
import { Car } from "../../types/car";

type Props = {
  car: Car;
};

export default function CatalogCard({ car }: Props) {

  const [open, setOpen] = useState(false);

  return (
    <div
      className="
      overflow-hidden
      rounded-2xl
      bg-white
      dark:bg-slate-900
      shadow
      hover:shadow-xl
      transition-all
      duration-300
      "
    >
      <div className="aspect-[16/10] bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        {car.image ? (
          <img
            src={car.image}
            alt={car.model}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-slate-400">
            Фото скоро появится
          </span>
        )}
      </div>

      <div className="p-6">

        <div className="text-sm text-slate-500">
          {car.brand.name}
        </div>

        <h2 className="mt-1 text-2xl font-bold">
          {car.model}
        </h2>

        <div className="mt-3 text-slate-600 dark:text-slate-400">
          {car.body}
        </div>

        <div className="mt-4 text-3xl font-bold text-blue-600">
          от {car.priceFrom.toLocaleString("ru-RU")} ₽
        </div>

        {car.description && (
          <p className="mt-4 line-clamp-3 text-sm text-slate-500">
            {car.description}
          </p>
        )}

        <button
  onClick={() => setOpen(!open)}
  className="
    mt-6
    w-full
    rounded-xl
    bg-blue-600
    py-3
    text-white
    hover:bg-blue-700
  "
>
  {open ? "Скрыть дилеров" : "Подробнее"}
</button>
{open && (
  <div className="mt-4 rounded-xl bg-slate-100 dark:bg-slate-800 p-4">

    <div className="font-semibold mb-3">
      Где купить
    </div>

    {car.dealers.length === 0 ? (

      <div className="text-slate-500">
        Для этого автомобиля дилеры не выбраны.
      </div>

    ) : (

      <div className="space-y-2">

        {car.dealers.map((dealer) => (

          <div
            key={dealer.id}
            className="
              rounded-lg
              bg-white
              dark:bg-slate-900
              border
              px-4
              py-3
            "
          >
            🏢 {dealer.name}
          </div>

        ))}

      </div>

    )}

  </div>
)}

      </div>
    </div>
  );
}
