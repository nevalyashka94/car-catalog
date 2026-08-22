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
          priceOk = car.priceFrom >= 2000000 && car.priceFrom < 3000000;
          break;
        case "3000000-4000000":
          priceOk = car.priceFrom >= 3000000 && car.priceFrom < 4000000;
          break;
        case "4000000-5000000":
          priceOk = car.priceFrom >= 4000000 && car.priceFrom < 5000000;
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
      <div className="py-24 text-center font-bold text-slate-500 dark:text-slate-400">
        Загрузка каталога...
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Единая плашка фильтрации */}
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm backdrop-blur-2xl transition-colors duration-300 dark:border-white/[0.08] dark:bg-[#0c1017]/80 dark:shadow-2xl sm:p-6">
        
        {/* Верхний ряд: Капсула цен + Поиск + Селект брендов */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Капсула цен */}
          <div className="flex items-center gap-1 overflow-x-auto rounded-2xl border border-slate-200/80 bg-slate-100/80 p-1.5 dark:border-white/[0.05] dark:bg-[#06080d]">
            {priceButtons.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPriceFilter(item.id)}
                className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-xs font-semibold transition-all duration-200 ${
                  priceFilter === item.id
                    ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/30"
                    : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Правая часть: Поиск + Селект брендов */}
          <div className="flex min-w-[280px] flex-1 items-center justify-end gap-3">
            {/* Поиск */}
            <div className="relative max-w-sm flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Поиск модели, марки..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-xs text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 dark:border-white/[0.05] dark:bg-[#06080d] dark:text-white dark:placeholder-slate-500 dark:focus:border-sky-500/50"
              />
            </div>

            {/* Бренды */}
            <div className="relative">
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-5 pr-10 text-xs font-semibold text-slate-700 outline-none transition-all hover:border-slate-300 focus:border-blue-500 dark:border-white/[0.05] dark:bg-[#06080d] dark:text-slate-300 dark:hover:border-white/10 dark:focus:border-sky-500/50"
              >
                <option value="" className="bg-white text-slate-900 dark:bg-[#06080d] dark:text-white">
                  Все бренды
                </option>
                {brands.map((item) => (
                  <option key={item} value={item} className="bg-white text-slate-900 dark:bg-[#06080d] dark:text-white">
                    {item}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                ▼
              </span>
            </div>
          </div>
        </div>

        {/* Нижний ряд: Селект кузова + Кнопка сброса */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-white/[0.04]">
          <div className="relative">
            <select
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-5 pr-10 text-xs font-semibold text-slate-700 outline-none transition-all hover:border-slate-300 focus:border-blue-500 dark:border-white/[0.05] dark:bg-[#06080d] dark:text-slate-300 dark:hover:border-white/10 dark:focus:border-sky-500/50"
            >
              <option value="" className="bg-white text-slate-900 dark:bg-[#06080d] dark:text-white">
                Все кузова
              </option>
              {bodies.map((item) => (
                <option key={item} value={item} className="bg-white text-slate-900 dark:bg-[#06080d] dark:text-white">
                  {item}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
              ▼
            </span>
          </div>

          {(brand || body || priceFilter !== "all" || search) && (
            <button
              type="button"
              onClick={() => {
                setBrand("");
                setBody("");
                setPriceFilter("all");
                setSearch("");
              }}
              className="text-xs font-semibold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              Сбросить фильтры
            </button>
          )}
        </div>

      </div>

      {/* Сетка карточек */}
      <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
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
