import { useEffect, useMemo, useRef, useState } from "react";
import {
  getRegions,
  getBrandsByRegion,
} from "../services/regionCoverage";
import { loadCatalog } from "../services/catalog";
import CatalogCard from "../components/catalog/CatalogCard";
import { Car } from "../types/car";

export default function Regions() {
  const [regions, setRegions] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  const [cars, setCars] = useState<Car[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingCars, setLoadingCars] = useState(false);

  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getRegions();
        setRegions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredRegions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return regions;
    }

    return regions.filter((city) =>
      city.toLowerCase().includes(query)
    );
  }, [regions, search]);

  async function selectRegion(city: string) {
    setSearch(city);
    setSelectedRegion(city);
    setShowSuggestions(false);
    setCars([]);

    try {
      setLoadingCars(true);

      const [regionBrands, catalogCars] = await Promise.all([
        getBrandsByRegion(city),
        loadCatalog(),
      ]);

      const availableBrands = new Set(
        regionBrands.map((brand) =>
          brand.trim().toLowerCase()
        )
      );

      const filteredCars = catalogCars.filter((car) =>
        availableBrands.has(
          car.brand?.name?.trim().toLowerCase()
        )
      );

      setCars(filteredCars);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingCars(false);
    }
  }

  function handleSearchChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const value = event.target.value;

    setSearch(value);
    setSelectedRegion("");
    setCars([]);
    setShowSuggestions(true);
  }

  return (
    <div className="space-y-10">

      {/* БЛОК ПОИСКА И ВЫБОРА РЕГИОНА */}
      <div className="rounded-[36px] border border-slate-200/80 bg-white/80 p-8 shadow-xl backdrop-blur-2xl transition-colors duration-300 dark:border-white/[0.08] dark:bg-[#0c1017]/80 dark:shadow-2xl sm:p-12">
        
        {/* Бейдж */}
        <div className="inline-flex items-center gap-2.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-blue-600 dark:text-sky-400">
          <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6] animate-pulse" />
          <span>Доступность автомобилей</span>
        </div>

        {/* Заголовок */}
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Автомобили <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">по регионам</span>
        </h1>

        <p className="mt-3 max-w-xl text-sm text-slate-500 dark:text-slate-400 sm:text-base">
          Найдите свой город и узнайте, какие автомобили доступны у дилеров в вашем регионе.
        </p>

        {/* Инпут поиска с подсказками */}
        <div ref={searchRef} className="relative mt-8 max-w-xl">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            🔍
          </span>

          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(true)}
            disabled={loading}
            placeholder={
              loading
                ? "Загрузка базы регионов..."
                : "Начните вводить название города..."
            }
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-xs font-medium text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 dark:border-white/[0.08] dark:bg-[#06080d] dark:text-white dark:placeholder-slate-500 dark:focus:border-sky-500/50"
          />

          {/* Выпадающий список городов */}
          {showSuggestions && !loading && (
            <div className="absolute left-0 right-0 z-50 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#0c1017]/95">
              {filteredRegions.length > 0 ? (
                filteredRegions.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => selectRegion(city)}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-xs font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600 dark:text-slate-200 dark:hover:bg-white/[0.05] dark:hover:text-sky-400"
                  >
                    <span>📍</span>
                    <span>{city}</span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-4 text-center text-xs text-slate-400">
                  Регион по запросу не найден
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          <span>💡</span>
          <span>Начните ввод или выберите город из списка</span>
        </div>
      </div>

      {/* РЕЗУЛЬТАТЫ ПО ВЫБРАННОМУ ГОРОДУ */}
      {selectedRegion && (
        <div className="space-y-6">
          <div className="flex items-end justify-between gap-4 border-b border-slate-200/80 pb-5 dark:border-white/[0.08]">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Автомобили в городе <span className="text-blue-500 dark:text-sky-400">{selectedRegion}</span>
              </h2>

              {!loadingCars && (
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Доступно моделей: {cars.length}
                </p>
              )}
            </div>
          </div>

          {/* Статус загрузки или карточки */}
          {loadingCars ? (
            <div className="py-20 text-center text-sm font-semibold text-slate-400">
              Поиск доступных автомобилей в регионе...
            </div>
          ) : cars.length > 0 ? (
            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {cars.map((car) => (
                <CatalogCard
                  key={car.id}
                  car={car}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[32px] border border-slate-200 bg-white p-12 text-center text-sm font-medium text-slate-500 dark:border-white/10 dark:bg-[#0c1017]/80 dark:text-slate-400">
              В городе {selectedRegion} пока нет доступных автомобилей в базе.
            </div>
          )}
        </div>
      )}

    </div>
  );
}
