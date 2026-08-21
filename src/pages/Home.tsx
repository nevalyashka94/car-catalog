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
              min-h-[600px]
              overflow-hidden
              rounded-[28px]
              border
              border-slate-200
              bg-[#f7f9fc]
              shadow-sm
              dark:border-slate-800
              dark:bg-[#07101f]
            "
          >
            {/* ============================= */}
            {/* СВЕТЛАЯ СЦЕНА */}
            {/* ============================= */}

            <img
              src="./images/hero-scene-light.png"
              alt=""
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-y-0
                right-0
                z-0
                hidden
                h-full
                w-[62%]
                object-cover
                object-left
                lg:block
                dark:hidden
              "
            />

            {/* Градиент для читаемости текста */}
            <div
              className="
                pointer-events-none
                absolute
                inset-y-0
                left-0
                z-[1]
                hidden
                w-[65%]
                bg-gradient-to-r
                from-[#f7f9fc]
                via-[#f7f9fc]/95
                to-transparent
                lg:block
              "
            />

            {/* ============================= */}
            {/* ТЁМНАЯ СЦЕНА */}
            {/* ============================= */}

            <img
              src="./images/hero-scene-dark.png"
              alt=""
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-y-0
                right-0
                z-0
                hidden
                h-full
                w-[62%]
                object-cover
                object-left
                dark:block
              "
            />

            {/* Градиент для тёмной темы */}
            <div
              className="
                pointer-events-none
                absolute
                inset-y-0
                left-0
                z-[1]
                hidden
                w-[65%]
                bg-gradient-to-r
                from-[#07101f]
                via-[#07101f]/95
                to-transparent
                dark:block
              "
            />

            {/* ============================= */}
            {/* МЯГКОЕ СВЕЧЕНИЕ */}
            {/* ============================= */}

            <div
              className="
                pointer-events-none
                absolute
                -right-40
                top-1/2
                z-[1]
                hidden
                h-[500px]
                w-[500px]
                -translate-y-1/2
                rounded-full
                bg-blue-500/10
                blur-[120px]
                lg:block
              "
            />

            {/* ============================= */}
            {/* КОНТЕНТ */}
            {/* ============================= */}

            <div
              className="
                relative
                z-10
                flex
                min-h-[600px]
                items-center
                px-7
                py-14
                sm:px-10
                lg:px-14
              "
            >
              <div className="max-w-[570px]">

                {/* Верхняя подпись */}
                <div
                  className="
                    flex
                    items-center
                    gap-4
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[0.28em]
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  <span
                    className="
                      h-px
                      w-10
                      bg-blue-600
                    "
                  />

                  Современные китайские автомобили

                  <span
                    className="
                      hidden
                      h-px
                      w-10
                      bg-slate-300
                      sm:block
                      dark:bg-slate-700
                    "
                  />
                </div>

                {/* Заголовок */}
                <h1
                  className="
                    mt-7
                    text-[44px]
                    font-black
                    leading-[0.98]
                    tracking-[-0.04em]
                    text-slate-950
                    sm:text-[54px]
                    lg:text-[62px]
                    dark:text-white
                  "
                >
                  Найдите автомобиль,
                  <span
                    className="
                      block
                      text-blue-600
                      dark:text-blue-400
                    "
                  >
                    который подходит
                  </span>
                  <span className="block">
                    именно вам
                  </span>
                </h1>

                {/* Описание */}
                <p
                  className="
                    mt-7
                    max-w-[500px]
                    text-base
                    leading-7
                    text-slate-600
                    sm:text-lg
                    dark:text-slate-400
                  "
                >
                  Актуальные модели, проверенные дилеры
                  и лучшие предложения в вашем регионе.
                </p>

                {/* Кнопки */}
                <div
                  className="
                    mt-9
                    flex
                    flex-wrap
                    gap-3
                  "
                >
                  <a
                    href="#/"
                    className="
                      inline-flex
                      h-12
                      items-center
                      gap-3
                      rounded-xl
                      bg-blue-600
                      px-6
                      text-sm
                      font-bold
                      text-white
                      shadow-lg
                      shadow-blue-600/20
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:bg-blue-700
                    "
                  >
                    Смотреть автомобили
                    <span className="text-lg">
                      →
                    </span>
                  </a>

                  <a
                    href="#/regions"
                    className="
                      inline-flex
                      h-12
                      items-center
                      gap-3
                      rounded-xl
                      border
                      border-slate-300
                      bg-white/80
                      px-6
                      text-sm
                      font-bold
                      text-slate-800
                      backdrop-blur-sm
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:border-slate-400
                      dark:border-slate-700
                      dark:bg-slate-900/60
                      dark:text-white
                      dark:hover:border-slate-500
                    "
                  >
                    По регионам
                  </a>
                </div>

                {/* Статистика */}
                <div
                  className="
                    mt-12
                    flex
                    max-w-[510px]
                    border-t
                    border-slate-200
                    pt-6
                    dark:border-slate-800
                  "
                >
                  {/* Модели */}
                  <div
                    className="
                      flex-1
                      border-r
                      border-slate-200
                      dark:border-slate-800
                    "
                  >
                    <div
                      className="
                        text-2xl
                        font-black
                        tracking-tight
                        text-slate-950
                        dark:text-white
                      "
                    >
                      40+
                    </div>

                    <div
                      className="
                        mt-1
                        text-xs
                        font-medium
                        uppercase
                        tracking-wider
                        text-slate-500
                        dark:text-slate-500
                      "
                    >
                      моделей
                    </div>
                  </div>

                  {/* Бренды */}
                  <div
                    className="
                      flex-1
                      border-r
                      border-slate-200
                      pl-6
                      dark:border-slate-800
                    "
                  >
                    <div
                      className="
                        text-2xl
                        font-black
                        tracking-tight
                        text-slate-950
                        dark:text-white
                      "
                    >
                      20+
                    </div>

                    <div
                      className="
                        mt-1
                        text-xs
                        font-medium
                        uppercase
                        tracking-wider
                        text-slate-500
                        dark:text-slate-500
                      "
                    >
                      брендов
                    </div>
                  </div>

                  {/* Регионы */}
                  <div className="flex-1 pl-6">
                    <div
                      className="
                        text-2xl
                        font-black
                        tracking-tight
                        text-slate-950
                        dark:text-white
                      "
                    >
                      98
                    </div>

                    <div
                      className="
                        mt-1
                        text-xs
                        font-medium
                        uppercase
                        tracking-wider
                        text-slate-500
                        dark:text-slate-500
                      "
                    >
                      регионов
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
