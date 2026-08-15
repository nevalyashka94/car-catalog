import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import { ThemeProvider } from "../context/ThemeContext";
import { getRegions, getBrandsByRegion } from "../services/regionCoverage";
import { loadCatalog } from "../services/catalog";
import type { Car } from "../types/car";

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
        regionBrands.map((brand) => brand.trim().toLowerCase())
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

          <div>
            <h1 className="text-5xl font-extrabold">
              Автомобили по регионам
            </h1>

            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Выберите город, чтобы посмотреть доступные автомобили
            </p>
          </div>

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

          {selectedRegion && (
            <div>

              <div className="flex items-center justify-between gap-4">
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

              {loadingCars ? (
                <div className="mt-8 text-slate-500">
                  Загрузка автомобилей...
                </div>
              ) : cars.length > 0 ? (
                <div className="
                  mt-8
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  xl:grid-cols-3
                  gap-6
                ">
                  {cars.map((car) => (
                    <div
                      key={car.id}
                      className="
                        overflow-hidden
                        rounded-3xl
                        border
                        border-slate-200
                        dark:border-slate-700
                        bg-white
                        dark:bg-slate-900
                        shadow-sm
                      "
                    >
                      {car.image ? (
                        <img
                          src={car.image}
                          alt={`${car.brand.name} ${car.model}`}
                          className="
                            h-56
                            w-full
                            object-cover
                          "
                        />
                      ) : (
                        <div className="
                          h-56
                          flex
                          items-center
                          justify-center
                          bg-slate-100
                          dark:bg-slate-800
                          text-6xl
                        ">
                          🚗
                        </div>
                      )}

                      <div className="p-6">

                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {car.brand.name}
                        </div>

                        <h3 className="mt-1 text-2xl font-bold">
                          {car.model}
                        </h3>

                        <div className="mt-2 text-slate-500 dark:text-slate-400">
                          {car.body}
                        </div>

                        <div className="mt-5 text-xl font-bold text-blue-600">
                          от {car.priceFrom?.toLocaleString()} ₽
                        </div>

                        {car.dealers.length > 0 && (
                          <div className="mt-5">
                            <div className="mb-2 font-semibold">
                              Дилеры
                            </div>

                            <div className="space-y-2">
                              {car.dealers.map((dealer) => (
                                <div
                                  key={dealer.id}
                                  className="
                                    rounded-xl
                                    border
                                    border-slate-200
                                    dark:border-slate-700
                                    bg-slate-50
                                    dark:bg-slate-800
                                    px-4
                                    py-3
                                  "
                                >
                                  🏢 {dealer.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="
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
                ">
                  В выбранном городе пока нет автомобилей
                  соответствующих брендов.
                </div>
              )}

            </div>
          )}

        </div>
      </Layout>
    </ThemeProvider>
  );
}
