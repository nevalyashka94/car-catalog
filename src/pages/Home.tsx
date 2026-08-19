import Layout from "../layout/Layout";
import { ThemeProvider } from "../context/ThemeContext";

import Catalog from "../components/catalog/Catalog";

export default function Home() {
  return (
    <ThemeProvider>
      <Layout>
        <div className="space-y-12">

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

            {/* Декоративное свечение */}
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
                dark:bg-blue-500/10
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

            <div className="relative max-w-4xl">

              {/* Маленький бейдж */}
              <div
                className="
                  mb-5
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
                  font-semibold
                  text-blue-700
                  dark:border-blue-900
                  dark:bg-blue-950/50
                  dark:text-blue-300
                "
              >
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Каталог китайских автомобилей
              </div>

              {/* Заголовок */}
              <h1
                className="
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
                Найдите автомобиль,
                <span className="text-blue-600 dark:text-blue-400">
                  {" "}который подходит именно вам
                </span>
              </h1>

              {/* Описание */}
              <p
                className="
                  mt-6
                  max-w-2xl
                  text-base
                  leading-7
                  text-slate-600
                  sm:text-lg
                  dark:text-slate-400
                "
              >
                Сравнивайте модели, цены и доступность автомобилей
                по регионам в одном удобном каталоге.
              </p>

              {/* Кнопки */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <a
                  href="#/regions"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-blue-600
                    px-6
                    py-3.5
                    font-bold
                    text-white
                    shadow-lg
                    shadow-blue-600/20
                    transition
                    hover:-translate-y-0.5
                    hover:bg-blue-700
                    hover:shadow-xl
                    hover:shadow-blue-600/25
                  "
                >
                  📍 Автомобили по регионам
                </a>

                <a
                  href="#/admin"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    border
                    border-slate-300
                    bg-white
                    px-6
                    py-3.5
                    font-bold
                    text-slate-800
                    transition
                    hover:-translate-y-0.5
                    hover:border-slate-400
                    hover:bg-slate-50
                    dark:border-slate-700
                    dark:bg-slate-900
                    dark:text-white
                    dark:hover:border-slate-600
                    dark:hover:bg-slate-800
                  "
                >
                  ⚙ Админка
                </a>

              </div>

            </div>
          </section>

          {/* КАТАЛОГ */}
          <section>
            <div className="mb-6 flex items-end justify-between gap-4">

              <div>
                <h2
                  className="
                    text-2xl
                    font-extrabold
                    tracking-tight
                    text-slate-950
                    sm:text-3xl
                    dark:text-white
                  "
                >
                  Каталог автомобилей
                </h2>

                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  Выберите модель и узнайте подробности
                </p>
              </div>

            </div>

            <Catalog />
          </section>

        </div>
      </Layout>
    </ThemeProvider>
  );
}
