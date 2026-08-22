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
        relative
        flex
        flex-col
        overflow-hidden
        rounded-[28px]
        border
        border-slate-200/80
        bg-white/80
        shadow-[0_15px_35px_rgba(0,0,0,0.04)]
        backdrop-blur-xl
        transition-all
        duration-500
        ease-out
        hover:-translate-y-2
        hover:border-blue-500/40
        hover:shadow-[0_25px_50px_rgba(37,99,235,0.15)]
        dark:border-white/[0.08]
        dark:bg-[#0e1118]/70
        dark:hover:border-sky-400/40
        dark:hover:shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(56,189,248,0.15)]
      "
    >
      {/* Студийный блок авто */}
      <div
        className="
          relative
          flex
          h-64
          w-full
          items-center
          justify-center
          overflow-hidden
          border-b
          border-slate-100
          bg-radial
          from-slate-100
          to-slate-200/60
          p-6
          dark:border-white/[0.05]
          dark:from-slate-800/60
          dark:to-[#0a0d14]
        "
      >
        {/* Бейдж бренда */}
        <span
          className="
            absolute
            left-5
            top-5
            rounded-full
            border
            border-slate-200/60
            bg-white/80
            px-3.5
            py-1.5
            text-xs
            font-bold
            tracking-wider
            text-slate-800
            shadow-sm
            backdrop-blur-md
            dark:border-white/10
            dark:bg-[#060709]/80
            dark:text-slate-200
          "
        >
          {car.brand}
        </span>

        {/* Бейдж кузова */}
        <span
          className="
            absolute
            right-5
            top-5
            flex
            items-center
            gap-1.5
            rounded-full
            border
            border-blue-500/20
            bg-blue-50/80
            px-3
            py-1
            text-xs
            font-semibold
            text-blue-600
            backdrop-blur-md
            dark:border-blue-500/30
            dark:bg-blue-950/40
            dark:text-sky-400
          "
        >
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_#3b82f6]" />
          {car.body}
        </span>

        {/* Изображение / Иконка с эффектом масштабирования */}
        <div
          className="
            text-7xl
            transition-transform
            duration-500
            ease-out
            group-hover:scale-110
            group-hover:-translate-y-1
          "
        >
          🚗
        </div>
      </div>

      {/* Контентная часть */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
        <div>
          <h3 className="font-['Space_Grotesk',sans-serif] text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            {car.model}
          </h3>

          <div className="mt-6 flex items-baseline justify-between border-t border-slate-100 pt-5 dark:border-white/[0.06]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Стоимость от
              </span>
              <div className="mt-0.5 font-['Space_Grotesk',sans-serif] text-2xl font-black tracking-tight text-blue-600 dark:bg-gradient-to-r dark:from-white dark:to-sky-400 dark:bg-clip-text dark:text-transparent">
                {car.priceText}
              </div>
            </div>
          </div>
        </div>

        {/* Кнопка подробнее */}
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
            bg-slate-900
            py-3.5
            font-semibold
            text-white
            shadow-md
            transition-all
            duration-300
            hover:bg-blue-600
            hover:shadow-lg
            hover:shadow-blue-500/25
            dark:bg-white/[0.06]
            dark:border
            dark:border-white/10
            dark:hover:bg-gradient-to-r
            dark:hover:from-blue-600
            dark:hover:to-sky-500
            dark:hover:border-transparent
          "
        >
          <span>{open ? "Скрыть дилеров" : "Подробнее"}</span>
          <span
            className={`transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          >
            ↓
          </span>
        </button>

        {/* Раскрывающийся список дилеров */}
        {open && (
          <div
            className="
              mt-5
              space-y-2
              rounded-2xl
              border
              border-slate-200/80
              bg-slate-50/80
              p-4
              backdrop-blur-md
              dark:border-white/[0.08]
              dark:bg-white/[0.02]
            "
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Официальные дилеры
            </h4>

            {loading ? (
              <div className="py-2 text-sm text-slate-400">Загрузка дилеров...</div>
            ) : dealers.length > 0 ? (
              <div className="space-y-2 pt-1">
                {dealers.map((dealer) => (
                  <div
                    key={dealer.id}
                    className="
                      flex
                      items-center
                      gap-2.5
                      rounded-xl
                      border
                      border-slate-200/60
                      bg-white
                      px-4
                      py-2.5
                      text-sm
                      font-medium
                      text-slate-800
                      shadow-sm
                      dark:border-white/[0.06]
                      dark:bg-[#060709]/60
                      dark:text-slate-200
                    "
                  >
                    <span>🏢</span>
                    <span>{dealer.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-1 text-xs text-slate-400">
                Для этого автомобиля дилеры не найдены.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
