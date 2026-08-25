import { useEffect, useMemo, useState } from "react";
import { getRegions, getBrandsByRegion } from "../services/regionCoverage";
import { loadCatalog } from "../services/catalog";
import { Car } from "../types/car";
import CatalogCard from "../components/catalog/CatalogCard";

interface RegionsProps {
  initialCity?: string;
}

export default function Regions({ initialCity }: RegionsProps) {
  const [regions, setRegions] = useState<string[]>([]);
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedRegion, setSelectedRegion] = useState<string>(initialCity || "");
  const [searchRegion, setSearchRegion] = useState<string>(initialCity || "");
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(false);

  useEffect(() => {
    if (initialCity) {
      setSelectedRegion(initialCity);
      setSearchRegion(initialCity);
    }
  }, [initialCity]);

  useEffect(() => {
    async function init() {
      try {
        const [regList, carsList] = await Promise.all([
          getRegions(),
          loadCatalog(),
        ]);
        setRegions(regList);
        setAllCars(carsList);

        if (initialCity && regList.includes(initialCity)) {
          loadRegionBrands(initialCity);
        }
      } catch (e) {
        console.error("Ошибка загрузки данных регионов:", e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const loadRegionBrands = async (cityName: string) => {
    setLoadingBrands(true);
    try {
      const brands = await getBrandsByRegion(cityName);
      setAvailableBrands(brands);
    } catch (e) {
      console.error(e);
      setAvailableBrands([]);
    } finally {
      setLoadingBrands(false);
    }
  };

  const handleSelectRegion = (city: string) => {
    setSelectedRegion(city);
    setSearchRegion(city);
    loadRegionBrands(city);
  };

  // Фильтр списка городов в подсказках
  const filteredRegionsList = useMemo(() => {
    if (!searchRegion.trim()) return regions.slice(0, 12);
    return regions.filter((r) =>
      r.toLowerCase().includes(searchRegion.toLowerCase())
    );
  }, [regions, searchRegion]);

  // Список автомобилей дилеров выбранного города
  const cityCars = useMemo(() => {
    if (!selectedRegion || availableBrands.length === 0) return [];
    const brandSet = new Set(availableBrands.map((b) => b.trim().toLowerCase()));
    return allCars.filter((car) =>
      brandSet.has(car.brand?.name?.trim().toLowerCase())
    );
  }, [allCars, availableBrands, selectedRegion]);

  if (loading) {
    return (
      <div className="py-24 text-center font-bold text-slate-500 dark:text-slate-400">
        Загрузка карты дилерских центров...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Карточка выбора города */}
      <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-xl backdrop-blur-2xl dark:border-white/[0.08] dark:bg-[#0c1017]/90 sm:p-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3.5 py-1.5 text-xs font-bold text-blue-600 dark:bg-sky-500/10 dark:text-sky-400">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse dark:bg-sky-400" />
            Доступность автомобилей
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Автомобили <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">по регионам</span>
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Найдите свой город и узнайте, какие автомобили доступны у официальных дилеров в вашем регионе.
          </p>
        </div>

        {/* Поле поиска города */}
        <div className="mt-6 max-w-xl">
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-slate-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Начните вводить название города..."
              value={searchRegion}
              onChange={(e) => setSearchRegion(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 dark:border-white/[0.08] dark:bg-[#06080d] dark:text-white dark:focus:border-sky-500"
            />
          </div>

          {/* Быстрые чипсы городов */}
          <div className="mt-3.5 flex flex-wrap gap-2">
            {filteredRegionsList.slice(0, 8).map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => handleSelectRegion(city)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${
                  selectedRegion === city
                    ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md shadow-blue-500/25"
                    : "border border-slate-200 bg-slate-100 text-slate-700 hover:border-blue-500 hover:bg-white dark:border-white/[0.05] dark:bg-white/[0.04] dark:text-slate-300 dark:hover:border-sky-400"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Результаты по выбранному региону */}
      {selectedRegion && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Дилеры в г. {selectedRegion}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {loadingBrands
                  ? "Обновление дилерской базы..."
                  : `Доступно брендов: ${availableBrands.length} | Моделей в каталоге: ${cityCars.length}`}
              </p>
            </div>

            {/* Бренды в наличии */}
            <div className="flex flex-wrap gap-1.5">
              {availableBrands.map((b) => (
                <span
                  key={b}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:border-white/10 dark:bg-[#0c1017] dark:text-slate-300"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Сетка карточек */}
          {loadingBrands ? (
            <div className="py-16 text-center text-sm font-semibold text-slate-400">
              Поиск автомобилей в регионе...
            </div>
          ) : cityCars.length > 0 ? (
            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {cityCars.map((car) => (
                <CatalogCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-sm font-medium text-slate-500 dark:border-white/10 dark:text-slate-400">
              В данном регионе официальные дилеры из каталога пока не представлены.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
