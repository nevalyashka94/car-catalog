import { useState } from "react";
import { Car } from "../../types/car";

type Props = {
  car: Car;
};

export default function CatalogCard({ car }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <article
      className="
        group
        overflow-hidden
        rounded-3xl
        border
        border-slate-200/80
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-slate-300
        hover:shadow-2xl
        dark:border-slate-800
        dark:bg-slate-900
        dark:hover:border-slate-700
      "
    >
      {/* Фото */}
      <div
        className="
          relative
          aspect-[16/10]
          overflow-hidden
          bg-slate-100
          dark:bg-slate-800
        "
      >
        {car.image ? (
          <img
            src={car.image}
            alt={`${car.brand.name} ${car.model}`}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-[1.03]
            "
          />
        ) : (
          <div
            className="
              flex
              h-full
              items-center
              justify-center
              text-sm
              font-medium
              text-slate-400
            "
          >
            Фото скоро появится
          </div>
        )}

        {/* Бейдж бренда */}
        <div
          className="
            absolute
            left-4
            top-4
            rounded-full
            border
            border-white/60
            bg-white/90
            px-3
            py-1.5
            text-xs
            font-bold
            text-slate-800
            shadow-sm
            backdrop-blur
            dark:border-slate-700/60
            dark:bg-slate-900/90
            dark:text-white
          "
        >
          {car.brand.name}
        </div>
      </div>

      {/* Контент */}
      <div className="p-5 sm:p-6">

        {/* Модель */}
        <div>
          <h2
            className="
              text-2xl
              font-extrabold
              tracking-tight
              text-slate-950
              dark:text-white
            "
          >
            {car.model}
          </h2>

          <div
            className="
              mt-2
              flex
              items-center
              gap-2
              text-sm
              font-medium
              text-slate-500
              dark:text-slate-400
            "
          >
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            {car.body}
          </div>
        </div>

        {/* Цена */}
        <div className="mt-6">
          <div
            className="
              text-xs
              font-semibold
              uppercase
              tracking-wider
              text-slate-400
            "
          >
            Цена от
          </div>

          <div
            className="
              mt-1
              text-2xl
              font-black
              tracking-tight
              text-blue-600
              dark:text-blue-400
            "
          >
            {car.priceFrom.toLocaleString("ru-RU")} ₽
          </div>
        </div>

        {/* Описание */}
        {car.description && (
          <p
            className="
              mt-4
              line-clamp-2
              text-sm
              leading-6
              text-slate-500
              dark:text-slate-400
            "
          >
            {car.description}
          </p>
        )}

        {/* Кнопка */}
        <button
          onClick={() => setOpen(!open)}
          className="
            mt-6
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-slate-950
            px-4
            py-3.5
            text-sm
            font-bold
            text-white
            shadow-sm
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:bg-blue-600
            hover:shadow-lg
            dark:bg-white
            dark:text-slate-950
            dark:hover:bg-blue-500
            dark:hover:text-white
          "
        >
          <span>
            {open ? "Скрыть дилеров" : "Подробнее"}
          </span>

          <span
            className={`
              transition-transform
              duration-200
              ${open ? "rotate-180" : ""}
            `}
          >
            ↓
          </span>
        </button>

        {/* Дилеры */}
        {open && (
          <div
            className="
              mt-4
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              p-4
              dark:border-slate-800
              dark:bg-slate-950
            "
          >
            <div
              className="
                mb-3
                text-sm
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              Где купить
            </div>

            {car.dealers.length === 0 ? (
              <div
                className="
                  text-sm
                  leading-6
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Для этого автомобиля дилеры не выбраны.
              </div>
            ) : (
              <div className="space-y-2">
                {car.dealers.map((dealer) => (
                  <div
                    key={dealer.id}
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-3
                      text-sm
                      font-medium
                      text-slate-700
                      transition
                      hover:border-blue-200
                      hover:bg-blue-50
                      dark:border-slate-800
                      dark:bg-slate-900
                      dark:text-slate-300
                      dark:hover:border-blue-900
                      dark:hover:bg-blue-950/30
                    "
                  >
                    <span className="text-base">
                      🏢
                    </span>

                    <span>
                      {dealer.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </article>
  );
}
