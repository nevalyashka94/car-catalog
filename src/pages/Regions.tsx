import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import { ThemeProvider } from "../context/ThemeContext";
import { getRegions, getBrandsByRegion } from "../services/regionCoverage";

export default function Regions() {
  const [regions, setRegions] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBrands, setLoadingBrands] = useState(false);

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
    setBrands([]);

    if (!city) {
      return;
    }

    try {
      setLoadingBrands(true);

      const data = await getBrandsByRegion(city);

      setBrands(data);
    } catch (error) {
      console.error(error);
      alert("Ошибка загрузки автомобилей региона");
    } finally {
      setLoadingBrands(false);
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

          <div className="
            max-w-xl
            rounded-2xl
            border
            border-slate-200
            dark:border-slate-700
            bg-white
            dark:bg-slate-900
            p-6
            shadow-sm
          ">

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

              <h2 className="text-3xl font-bold">
                Доступные бренды в городе {selectedRegion}
              </h2>

              {loadingBrands ? (
                <div className="mt-6 text-slate-500">
                  Загрузка...
                </div>
              ) : brands.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-3">

                  {brands.map((brand) => (
                    <div
                      key={brand}
                      className="
                        rounded-xl
                        border
                        border-slate-200
                        dark:border-slate-700
                        bg-white
                        dark:bg-slate-900
                        px-5
                        py-3
                        font-semibold
                        shadow-sm
                      "
                    >
                      🚗 {brand}
                    </div>
                  ))}

                </div>
              ) : (
                <div className="mt-6 text-slate-500">
                  Для этого города пока нет данных о доступных автомобилях.
                </div>
              )}

            </div>
          )}

        </div>
      </Layout>
    </ThemeProvider>
  );
}
