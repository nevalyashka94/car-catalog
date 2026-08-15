import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import { ThemeProvider } from "../context/ThemeContext";
import { getRegions, getBrandsByRegion } from "../services/regionCoverage";
import { loadCatalog } from "../services/catalog";
import CatalogCard from "../components/catalog/CatalogCard";
import { Car } from "../types/car";

export default function Regions() {
  const [regions, setRegions] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("");

  const [cars, setCars] = useState<Car[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingCars, setLoadingCars] = useState(false);

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

  async function handleRegionChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const city = event.target.value;

    setSelectedRegion(city);
    setCars([]);

    if (!city) {
      return;
    }

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
              Выберите город, чтобы посмотреть доступные автомобили
            </p>
          </div>

          {/* Выбор региона */}
          <div
            className="
              max-w-xl
              rounded-2xl
              border
              border-slate-200
              dark:border-slate-700
              bg-white
              dark:bg-slate-900
              p-6
              shadow-sm
            "
          >
            <label className="block mb-3 font-semibold">
              Регион
            </label>

            <select
              value={selectedRegion}
              onChange={handleRegionChange}
              disabled={loading}
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
                p-3
              "
            >
              <option value="">
                {loading
                  ? "Загрузка регионов..."
                  : "Выберите город"}
              </option>

              {regions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
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
