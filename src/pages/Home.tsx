import Layout from "../layout/Layout";
import { ThemeProvider } from "../context/ThemeContext";

import Catalog from "../components/catalog/Catalog";

export default function Home() {
  return (
    <ThemeProvider>
      <Layout>
        <div className="space-y-10">

          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-6xl font-extrabold">
                Каталог автомобилей Auto.ru
              </h1>

              <p className="mt-3 text-slate-500">
                Все автомобили теперь загружаются из базы данных
              </p>

            </div>

           <div className="flex items-center gap-3">

  <a
    href="#/regions"
    className="
      rounded-xl
      bg-emerald-600
      hover:bg-emerald-700
      text-white
      px-5
      py-3
      font-semibold
      transition
    "
  >
    📍 Автомобили по регионам
  </a>

  <a
    href="#/admin"
    className="
      rounded-xl
      bg-blue-600
      hover:bg-blue-700
      text-white
      px-5
      py-3
      font-semibold
      transition
    "
  >
    ⚙ Админка
  </a>

</div>

          </div>

          <Catalog />

        </div>
      </Layout>
    </ThemeProvider>
  );
}
