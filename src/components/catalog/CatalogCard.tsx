import { useEffect, useState } from "react";
import { Car } from "../../types/car";
import { getDealersForCar } from "../../services/carDealerView";

interface Dealer {
  id: number;
  name: string;
  city?: string;
  address?: string;
  phone?: string;
}

interface Props {
  car: Car;
}

export default function CatalogCard({ car }: Props) {
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
        console.error("Ошибка загрузки ДЦ из базы данных:", e);
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
          <span>{open ? "Скрыть дилеров" : "Подробнее"}</span>
          <span className={`text-sm transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
            ↓
          </span>
        </button>

        {/* Раскрывающийся список ДЦ из базы данных */}
        {open && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-[#06080d] p-4">
            <div className="mb-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span>Официальные дилеры ({dealers.length})</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
            </div>

            {loading ? (
              <div className="py-3 text-center text-xs text-slate-500 animate-pulse">
                Загрузка дилерских центров...
              </div>
            ) : dealers.length > 0 ? (
              <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
                {dealers.map((dealer) => (
                  <div
                    key={dealer.id}
                    className="flex flex-col gap-1 rounded-xl border border-white/5 bg-[#121826] p-3 text-xs text-slate-200"
                  >
                    <div className="flex items-center gap-2 font-semibold text-white">
                      <span>🏢</span>
                      <span>{dealer.name}</span>
                    </div>

                    {(dealer.city || dealer.address) && (
                      <div className="pl-6 text-[11px] text-slate-400">
                        {dealer.city && <span className="text-slate-300">{dealer.city}, </span>}
                        {dealer.address}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-2 text-center text-xs text-slate-500">
                В вашем регионе официальные ДЦ пока не добавлены в базу
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
