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

          {/* HERO */}
          <section
            className="
              relative
              overflow-hidden
              rounded-[32px]
              border
              border-slate-200
              bg-gradient-to-br
              from-slate-50
              via-white
              to-blue-50
              px-6
              py-10
              shadow-sm
              dark:border-slate-800
              dark:from-slate-900
              dark:via-slate-950
              dark:to-blue-950/30
              sm:px-10
              sm:py-14
              lg:px-14
              lg:py-16
            "
          >
            {/* Декоративные элементы */}
            <div
              className="
                pointer-events-none
                absolute
                -right-24
                -top-24
                h-72
                w-72
                rounded-full
                bg-blue-500/10
                blur-3xl
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-32
                right-20
                h-64
                w-64
                rounded-full
                bg-indigo-500/10
                blur-3xl
              "
            />

            <div className="relative">

              {/* Бейдж */}
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-blue-200
                  bg-blue-50
                  px-4
                  py-2
                  text-sm
                  font-bold
                  text-blue-700
                  dark:border-blue-900
                  dark:bg-blue-950/50
                  dark:text-blue-300
                "
              >
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Доступность автомобилей
              </div>

              {/* Заголовок */}
              <h1
                className="
                  mt-6
                  max-w-4xl
                  text-4xl
                  font-black
                  leading-[1.05]
                  tracking-tight
                  text-slate-950
                  sm:text-5xl
                  lg:text-6xl
                  dark:text-white
                "
              >
                Автомобили
                <span className="text-blue-600 dark:text-blue-400">
                  {" "}по регионам
                </span>
              </h1>

              <p
                className="
                  mt-5
                  max-w-2xl
                  text-base
                  leading-7
                  text-slate-600
                  sm:text-lg
                  dark:text-slate-400
                "
              >
                Найдите свой город и узнайте, какие автомобили
                доступны в вашем регионе.
              </p>

              {/* ПОИСК */}
              <div
                ref={searchRef}
                className="
                  relative
                  mt-8
                  max-w-2xl
                "
              >
                <div className="relative">

                  <div
                    className="
                      pointer-events-none
                      absolute
                      left-5
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                      dark:text-slate-500
                    "
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="7" />
                      <path d="m20 20-4-4" />
                    </svg>
                  </div>

                  <input
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    onFocus={() => setShowSuggestions(true)}
                    disabled={loading}
                    placeholder={
                      loading
                        ? "Загрузка регионов..."
                        : "Начните вводить название города..."
                    }
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      px-5
                      py-4
                      pl-14
                      text-base
                      font-medium
                      text-slate-900
                      shadow-lg
                      shadow-slate-900/5
                      outline-none
                      transition-all
                      placeholder:text-slate-400
                      hover:border-slate-300
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-500/10
                      dark:border-slate-700
                      dark:bg-slate-900
                      dark:text-white
                      dark:shadow-black/20
                      dark:placeholder:text-slate-500
                      dark:hover:border-slate-600
                      dark:focus:border-blue-500
                    "
                  />
                </div>

                {/* СПИСОК ГОРОДОВ */}
                {showSuggestions && !loading && (
                  <div
                    className="
                      absolute
                      left-0
                      right-0
                      z-50
                      mt-3
                      max-h-80
                      overflow-y-auto
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      p-2
                      shadow-2xl
                      shadow-slate-900/10
                      dark:border-slate-700
                      dark:bg-slate-900
                      dark:shadow-black/40
                    "
                  >
                    {filteredRegions.length > 0 ? (
                      filteredRegions.map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => selectRegion(city)}
                          className="
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-xl
                            px-4
                            py-3
                            text-left
                            text-sm
                            font-semibold
                            text-slate-700
                            transition
                            hover:bg-blue-50
                            hover:text-blue-700
                            dark:text-slate-300
                            dark:hover:bg-blue-950/40
                            dark:hover:text-blue-300
                          "
                        >
                          <span
                            className="
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              bg-slate-100
                              text-sm
                              dark:bg-slate-800
                            "
                          >
                            📍
                          </span>

                          {city}
                        </button>
                      ))
                    ) : (
                      <div
                        className="
                          px-4
                          py-6
                          text-center
                          text-sm
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

              {/* Подсказка */}
              {!selectedRegion && (
                <div
                  className="
                    mt-4
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  <span>💡</span>
                  Можно выбрать город из списка или начать вводить его название
                </div>
              )}

            </div>
          </section>

          {/* ВЫБРАННЫЙ РЕГИОН */}
          {selectedRegion && (
            <section>

              <div
                className="
                  mb-7
                  flex
                  flex-col
                  gap-4
                  sm:flex-row
                  sm:items-end
                  sm:justify-between
                "
              >
                <div>

                  <div
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      bg-blue-50
                      px-3
                      py-1.5
                      text-xs
                      font-bold
                      text-blue-700
                      dark:bg-blue-950/50
                      dark:text-blue-300
                    "
                  >
                    <span>📍</span>
                    {selectedRegion}
                  </div>

                  <h2
                    className="
                      mt-3
                      text-3xl
                      font-black
                      tracking-tight
                      text-slate-950
                      sm:text-4xl
                      dark:text-white
                    "
                  >
                    Автомобили в регионе
                  </h2>

                  {!loadingCars && (
                    <p
                      className="
                        mt-2
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      {cars.length > 0
                        ? `Найдено автомобилей: ${cars.length}`
                        : "Доступных автомобилей пока нет"}
                    </p>
                  )}

                </div>

                {/* Сменить город */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRegion("");
                    setCars([]);
                    setSearch("");
                  }}
                  className="
                    w-fit
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-2.5
                    text-sm
                    font-bold
                    text-slate-700
                    transition
                    hover:border-blue-200
                    hover:bg-blue-50
                    hover:text-blue-700
                    dark:border-slate-700
                    dark:bg-slate-900
                    dark:text-slate-300
                    dark:hover:border-blue-900
                    dark:hover:bg-blue-950/30
                    dark:hover:text-blue-300
                  "
                >
                  ← Выбрать другой город
                </button>
              </div>

              {/* Загрузка */}
              {loadingCars ? (
                <div
                  className="
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    py-20
                    text-center
                    shadow-sm
                    dark:border-slate-800
                    dark:bg-slate-900
                  "
                >
                  <div
                    className="
                      mx-auto
                      mb-4
                      h-10
                      w-10
                      animate-spin
                      rounded-full
                      border-4
                      border-slate-200
                      border-t-blue-600
                      dark:border-slate-700
                      dark:border-t-blue-400
                    "
                  />

                  <p
                    className="
                      text-sm
                      font-medium
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Загружаем автомобили...
                  </p>
                </div>
              ) : cars.length > 0 ? (

                /* Карточки */
                <div
                  className="
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

                /* Пустое состояние */
                <div
                  className="
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    px-6
                    py-16
                    text-center
                    shadow-sm
                    dark:border-slate-800
                    dark:bg-slate-900
                  "
                >
                  <div className="text-5xl">
                    🚗
                  </div>

                  <h3
                    className="
                      mt-5
                      text-xl
                      font-extrabold
                      text-slate-950
                      dark:text-white
                    "
                  >
                    Пока нет доступных автомобилей
                  </h3>

                  <p
                    className="
                      mx-auto
                      mt-2
                      max-w-md
                      text-sm
                      leading-6
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Для выбранного региона пока не найдено
                    автомобилей соответствующих доступным брендам.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRegion("");
                      setCars([]);
                      setSearch("");
                    }}
                    className="
                      mt-6
                      rounded-xl
                      bg-blue-600
                      px-5
                      py-3
                      text-sm
                      font-bold
                      text-white
                      transition
                      hover:bg-blue-700
                    "
                  >
                    Выбрать другой регион
                  </button>
                </div>

              )}

            </section>
          )}

        </div>
      </Layout>
    </ThemeProvider>
  );
}
