import Layout from "../layout/Layout";
import { ThemeProvider } from "../context/ThemeContext";
import Catalog from "../components/catalog/Catalog";

export default function Home() {
  return (
    <ThemeProvider>
      <Layout>
        <main className="space-y-14">
          {/* HERO */}
          <section
            className="
              relative
              min-h-[540px]
              overflow-hidden
              rounded-[30px]
              border
              border-slate-200
              bg-[#f5f7fb]
              shadow-[0_20px_60px_rgba(15,23,42,0.08)]
              dark:border-slate-800
              dark:bg-[#06101d]
            "
          >
            {/* ================= LIGHT SCENE ================= */}

            <img
              src="/car-catalog/images/hero-scene-light.png"
              alt=""
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                right-0
                bottom-0
                hidden
                w-[70%]
                h-auto
                lg:block
                dark:hidden
              "
            />

            {/* ================= DARK SCENE ================= */}

            <img
              src="/car-catalog/images/hero-scene-dark.png"
              alt=""
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                right-0
                bottom-0
                hidden
                w-[70%]
                h-auto
                dark:block
              "
            />

            {/* ================= LEFT GRADIENT ================= */}

            <div
              className="
                pointer-events-none
                absolute
                inset-y-0
                left-0
                w-[62%]
                bg-gradient-to-r
                from-[#f5f7fb]
                via-[#f5f7fb]/95
                via-[#f5f7fb]/80
                to-transparent
                dark:from-[#06101d]
                dark:via-[#06101d]/95
                dark:via-[#06101d]/80
              "
            />

            {/* ================= CONTENT ================= */}

            <div
              className="
                relative
                z-10
                flex
                min-h-[540px]
                flex-col
                justify-center
                px-8
                py-12
                lg:px-14
              "
            >
              <div className="max-w-[560px]">
                {/* eyebrow */}

                <div
                  className="
                    mb-7
                    flex
                    items-center
                    gap-4
                  "
                >
                  <span className="h-px w-10 bg-blue-600" />

                  <span
                    className="
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-[0.28em]
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Современные китайские автомобили
                  </span>
                </div>

                {/* TITLE */}

                <h1
                  className="
                    text-[46px]
                    font-semibold
                    leading-[1.05]
                    tracking-[-0.035em]
                    text-slate-950
                    lg:text-[58px]
                    dark:text-white
                  "
                >
                  Найдите автомобиль,
                  <span className="block">
                    который подходит
                  </span>
                  <span className="block text-blue-600 dark:text-blue-400">
                    именно вам.
                  </span>
                </h1>

                {/* DESCRIPTION */}

                <p
                  className="
                    mt-6
                    max-w-[470px]
                    text-[17px]
                    leading-8
                    text-slate-600
                    dark:text-slate-400
                  "
                >
                  Актуальные модели, проверенные дилеры и лучшие предложения
                  для вашего региона — всё в одном каталоге.
                </p>

                {/* BUTTONS */}

                <div className="mt-9 flex gap-3">
                  <a
                    href="#/"
                    className="
                      inline-flex
                      items-center
                      gap-3
                      rounded-xl
                      bg-blue-600
                      px-6
                      py-3.5
                      text-sm
                      font-semibold
                      text-white
                      shadow-lg
                      shadow-blue-600/20
                      transition
                      hover:-translate-y-0.5
                      hover:bg-blue-700
                    "
                  >
                    Смотреть автомобили
                    <span className="text-lg">→</span>
                  </a>

                  <a
                    href="#/regions"
                    className="
                      inline-flex
                      items-center
                      rounded-xl
                      border
                      border-slate-300
                      bg-white/70
                      px-6
                      py-3.5
                      text-sm
                      font-semibold
                      text-slate-800
                      backdrop-blur-md
                      transition
                      hover:-translate-y-0.5
                      hover:border-slate-400
                      hover:bg-white
                      dark:border-slate-700
                      dark:bg-slate-900/60
                      dark:text-white
                      dark:hover:border-slate-600
                      dark:hover:bg-slate-800
                    "
                  >
                    По регионам
                  </a>
                </div>

                {/* BOTTOM INFO */}

                <div
                  className="
                    mt-12
                    flex
                    items-center
                    gap-8
                    border-t
                    border-slate-200
                    pt-6
                    text-sm
                    dark:border-slate-800
                  "
                >
                  <div>
                    <div className="text-2xl font-semibold text-slate-900 dark:text-white">
                      40+
                    </div>

                    <div className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                      моделей
                    </div>
                  </div>

                  <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />

                  <div>
                    <div className="text-2xl font-semibold text-slate-900 dark:text-white">
                      20+
                    </div>

                    <div className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                      брендов
                    </div>
                  </div>

                  <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />

                  <div>
                    <div className="text-2xl font-semibold text-slate-900 dark:text-white">
                      98
                    </div>

                    <div className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                      регионов
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CATALOG */}

          <section>
            <div className="mb-7">
              <h2
                className="
                  text-3xl
                  font-semibold
                  tracking-[-0.02em]
                  text-slate-950
                  dark:text-white
                "
              >
                Каталог автомобилей
              </h2>

              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Выберите автомобиль и узнайте подробную информацию о модели.
              </p>
            </div>

            <Catalog />
          </section>
        </main>
      </Layout>
    </ThemeProvider>
  );
}
