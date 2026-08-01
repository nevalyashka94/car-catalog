import CarList from "../components/admin/CarList";
import ImportCars from "../components/admin/ImportCars";
import ImportDealers from "../components/admin/ImportDealers";

export default function Admin() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <div className="flex">
        <aside className="w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800">
          <div className="p-6">
            <h1 className="text-2xl font-bold">
              🚗 Car Catalog CMS
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Панель управления
            </p>
          </div>

          <nav className="space-y-2 px-4">
            <button
              className="
                w-full
                rounded-xl
                bg-blue-600
                text-white
                p-3
                text-left
              "
            >
              🚗 Автомобили
            </button>

            <button
              className="
                w-full
                rounded-xl
                p-3
                text-left
                hover:bg-slate-100
                dark:hover:bg-slate-800
              "
            >
              🏢 Бренды
            </button>

            <button
              className="
                w-full
                rounded-xl
                p-3
                text-left
                hover:bg-slate-100
                dark:hover:bg-slate-800
              "
            >
              🤝 Дилеры
            </button>

            <button
              className="
                w-full
                rounded-xl
                p-3
                text-left
                hover:bg-slate-100
                dark:hover:bg-slate-800
              "
            >
              ⚙ Настройки
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-10">
          <div className="flex gap-4 mb-8 flex-wrap">
            <ImportCars />
            <ImportDealers />
          </div>

          <CarList />
        </main>
      </div>
    </div>
  );
}