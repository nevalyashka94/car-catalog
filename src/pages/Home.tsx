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
              min-h-[560px]
              overflow-hidden
              rounded-[32px]
              border
              border-slate-200
              bg-gradient-to-br
              from-slate-50
              via-white
              to-blue-50
              shadow-sm
              dark:border-slate-800
              dark:from-slate-950
              dark:via-slate-900
              dark:to-blue-950/40
            "
          >
            {/* Светлая декоративная подсветка */}
            <div
              className="
                pointer-events-none
                absolute
                -right-32
                -top-32
                h-96
                w-96
                rounded-full
                bg-blue-400/10
                blur-3xl
                dark:bg-blue-500/10
              "
            />

            {/* Затемнение/подсветка для dark */}
            <div
              className="
                pointer-events-none
                absolute
                bottom-0
                right-0
                h-full
                w-1/2
                bg-gradient-to-l
                from-blue-500/5
                to-transparent
                dark:from-blue-500/10
              "
            />

            {/* АВТОМОБИЛЬ — LIGHT */}
            <img
              src="/images/hero-car-light.png"
              alt=""
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                right-[-8%]
                top-1/2
                hidden
                w-[62%]
                max-w-[850px]
                -translate-y-1/2
                object-contain
                lg:block
                dark:hidden
              "
            />

            {/* АВТОМОБИЛЬ — DARK */}
            <img
              src="/images/hero-car-dark.png"
              alt=""
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                right-[-8%]
                top-1/2
                hidden
                w-[62%]
                max-w-[850px]
                -translate-y-1/2
                object-contain
                lg:hidden
                dark:block
              "
            />

            {/* Контент */}
            <div
              className="
                relative
                z-10
                flex
                min-h-[560px]
                items-center
                px-6
                py-12
                sm:px-10
                lg:px-14
              "
            >
              <div className="max-w-[570px]">

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
                    dark:bg-blue-950/60
                    dark:text-blue-300
                  "
                >
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  Большой выбор моделей
                </div>

                {/* Заголовок */}
                <h1
                  className="
                    mt-6
                    text-4xl
                    font-black
                    leading-[1.03]
                    tracking-tight
                    text-slate-950
                    sm:text-5xl
                    lg:text-6xl
                    dark:text-white
                  "
                >
                  Найдите автомобиль,
                  <span className="block text-blue-600 dark:text-blue-400">
                    который подходит
                  </span>
                  <span className="block">
                    именно вам
                  </span>
                </h1>

                {/* Описание */}
                <p
                  className="
                    mt-6
                    max-w-xl
                    text-base
                    leading-7
                    text-slate-600
                    sm:text-lg
                    dark:text-slate-400
                  "
                >
                  Современные китайские автомобили,
                  проверенные дилеры и актуальные предложения
                  в вашем регионе.
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
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:bg-blue-700
                      hover:shadow-xl
                    "
                  >
                    📍 Автомобили по регионам
                    <span>→</span>
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
                      bg-white/80
                      px-6
                      py-3.5
                      font-bold
                      text-slate-800
                      backdrop-blur
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:border-slate-400
                      hover:bg-white
                      dark:border-slate-700
                      dark:bg-slate-900/70
                      dark:text-white
                      dark:hover:border-slate-600
                      dark:hover:bg-slate-800
                    "
                  >
                    ⚙ Админка
                  </a>

                </div>

                {/* Преимущества */}
                <div
                  className="
                    mt-10
                    grid
                    grid-cols-3
                    gap-4
                    border-t
                    border-slate-200/80
                    pt-6
                    dark:border-slate-800
                  "
                >

                  <div>
                    <div
                      className="
                        mb-2
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-100
                        text-sm
                        dark:bg-blue-950
                      "
                    >
                      🚗
                    </div>

                    <div
                      className="
                        text-xs
                        font-bold
                        leading-5
                        text-slate-700
                        dark:text-slate-300
                      "
                    >
                      Популярные
                      <br />
                      бренды
                    </div>
                  </div>

                  <div>
                    <div
                      className="
                        mb-2
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-100
                        text-sm
                        dark:bg-blue-950
                      "
                    >
                      🛡️
                    </div>

                    <div
                      className="
                        text-xs
                        font-bold
                        leading-5
                        text-slate-700
                        dark:text-slate-300
                      "
                    >
                      Проверенные
                      <br />
                      дилеры
                    </div>
                  </div>

                  <div>
                    <div
                      className="
                        mb-2
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-100
                        text-sm
                        dark:bg-blue-950
                      "
                    >
                      📍
                    </div>

                    <div
                      className="
                        text-xs
                        font-bold
                        leading-5
                        text-slate-700
                        dark:text-slate-300
                      "
                    >
                      Доступность
                      <br />
                      по регионам
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </section>

          {/* КАТАЛОГ */}
          <section>

            <div className="mb-6">
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

              <p
                className="
                  mt-2
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Выберите модель и узнайте подробности
              </p>
            </div>

            <Catalog />

          </section>

        </div>
      </Layout>
    </ThemeProvider>
  );
}
