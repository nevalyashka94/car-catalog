import { useEffect, useMemo, useRef, useState } from "react";
import Layout from "../layout/Layout";
import { ThemeProvider } from "../context/ThemeContext";
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
    async function loadRegions() {
      try {
        const data = await getRegions();
        setRegions(data);
      } catch (error) {
        console.error(error);
        alert("Ошибка загрузки регионов");
      } finally {
        setLoading(false);
      }
    }

    loadRegions();
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
      return regions.slice(0, 10);
    }

    return regions
      .filter((city) =>
        city.toLowerCase().includes(query)
      )
      .slice(0, 10);
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
      alert("Ошибка загрузки автомобилей региона");
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
    <ThemeProvider>
      <Layout>
        <div className="space-y-10">

          {/* Заголовок */}
          <div>
            <h1 className="text-5xl font-extrabold">
              Автомобили по регионам
            </h1>

            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Начните вводить название города и выберите регион
            </p>
          </div>

          {/* Поиск региона */}
          <div
            ref={searchRef}
            className="relative max-w-xl"
          >
            <label className="mb-3 block font-semibold">
              Регион
            </label>

            <div className="relative">
              <span
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              >
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
                    ? "Загрузка регионов..."
                    : "Начните вводить город..."
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  dark:border-slate-600
                  bg-white
                  dark:bg-slate-800
                  text-slate-900
                  dark:text-white
                  placeholder:text-slate-400
                  p-4
                  pl-12
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/20
                "
              />
            </div>

            {/* Подсказки */}
            {showSuggestions && !loading && (
              <div
                className="
                  absolute
                  left-0
                  right-0
                  z-50
                  mt-2
                  overflow-hidden
                  rounded-xl
                  border
                  border-slate-200
                  dark:border-slate-700
                  bg-white
                  dark:bg-slate-900
                  shadow-xl
                "
              >
                {filteredRegions.length > 0 ? (
                  filteredRegions.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => selectRegion(city)}
                      className="
                        block
                        w-full
                        px-4
                        py-3
                        text-left
                        text-slate-900
                        dark:text-white
                        transition
                        hover:bg-slate-100
                        dark:hover:bg-slate-800
                      "
                    >
                      📍 {city}
                    </button>
                  ))
                ) : (
                  <div
                    className="
                      px-4
                      py-4
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Регион не найден
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Результаты */}
          {selectedRegion && (
            <div>

              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold">
                    Автомобили в городе {selectedRegion}
                  </h2>

                  {!loadingCars && (
                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                      Найдено автомобилей: {cars.length}
                    </p>
                  )}
                </div>
              </div>

              {/* Загрузка */}
              {loadingCars ? (
                <div className="mt-8 py-12 text-center text-slate-500">
                  Загрузка автомобилей...
                </div>
              ) : cars.length > 0 ? (

                /* Карточки */
                <div
                  className="
                    mt-8
                    grid
                    gap-6
                    md:grid-cols-2
                    xl:grid-cols-3
                  "
                >
                  {cars.map((car) => (
                    <CatalogCard
                      key={car.id}
                      car={car}
                    />
                  ))}
                </div>

              ) : (

                /* Если автомобилей нет */
                <div
                  className="
                    mt-8
                    rounded-2xl
                    border
                    border-slate-200
                    dark:border-slate-700
                    bg-white
                    dark:bg-slate-900
                    p-8
                    text-center
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  В выбранном городе пока нет
                  доступных автомобилей.
                </div>

              )}

            </div>
          )}

        </div>
      </Layout>
    </ThemeProvider>
  );
}
