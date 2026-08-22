import { useState } from "react";
import { Car } from "../../types/car";

interface Props {
  car: Car;
}

export default function CatalogCard({ car }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="
        group
        relative
        flex
        flex-col
        overflow-hidden
        rounded-[32px]
        border
        border-white/[0.08]
        bg-[#090d16]/95
        p-0
        shadow-2xl
        transition-all
        duration-300
        hover:-translate-y-1.5
        hover:border-sky-500/40
      "
    >
      {/* Изображение автомобиля */}
      <div className="relative flex h-[230px] w-full items-center justify-center overflow-hidden bg-[#06080d]">
        
        {/* Бейдж бренда */}
        <div className="absolute left-5 top-5 z-10 rounded-full border border-white/10 bg-[#0c111d]/90 px-4 py-1.5 text-xs font-bold tracking-wide text-white backdrop-blur-md">
          {car.brand.name}
        </div>

        {/* Иконка меню справа вверху */}
        <div className="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#0c111d]/90 text-xs text-slate-400 backdrop-blur-md">
          •••
        </div>

        {/* Кнопка с тултипом поиска по картинке */}
        <div className="absolute bottom-4 left-5 z-10 flex flex-col items-start gap-1">
          <span className="rounded-lg bg-black/80 px-2.5 py-1 text-[10px] font-semibold text-slate-200 backdrop-blur-md">
            Поиск по картинке
          </span>
          <div className="flex items-center gap-2 rounded-xl bg-white/95 px-2.5 py-1.5 text-xs font-bold text-slate-800 shadow-md">
            <span>📷</span>
            <span className="text-slate-300">|</span>
            <span>⋮</span>
          </div>
        </div>

        {/* Фото авто */}
        {car.image ? (
          <img
            src={car.image}
            alt={`${car.brand.name} ${car.model}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-7xl">
            🚗
          </div>
        )}
      </div>

      {/* Текстовая информация */}
      <div className="flex flex-1 flex-col justify-between p-7">
        <div>
          {/* Название модели */}
          <h3 className="text-2xl font-extrabold tracking-tight text-white">
            {car.model}
          </h3>

          {/* Кузов */}
          <div className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
            <span>{car.body}</span>
          </div>

          {/* Блок цены */}
          <div className="mt-6">
            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              ЦЕНА ОТ
            </div>
            <div className="mt-1 text-2xl font-black tracking-tight text-sky-400">
              {car.priceFrom ? `${car.priceFrom.toLocaleString("ru-RU")} ₽` : "По запросу"}
            </div>
          </div>
        </div>

        {/* Кнопка Подробнее */}
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
            border
            border-white/10
            bg-[#121826]
            py-3.5
            text-xs
            font-bold
            text-white
            shadow-inner
            transition-all
            duration-200
            hover:border-sky-500/40
            hover:bg-[#182033]
          "
        >
          <span>{open ? "Скрыть" : "Подробнее"}</span>
          <span className={`text-sm transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
            ↓
          </span>
        </button>
      </div>
    </div>
  );
}
