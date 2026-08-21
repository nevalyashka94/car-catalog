import Layout from "../layout/Layout";
import { ThemeProvider } from "../context/ThemeContext";
import Catalog from "../components/catalog/Catalog";

export default function Home() {
  return (
    <ThemeProvider>
      <Layout>
        <main className="space-y-14">

          {/* ================================================= */}
          {/* HERO — ЕДИНАЯ АВТОМОБИЛЬНАЯ СЦЕНА */}
          {/* ================================================= */}

          <section
            className="
              relative
              min-h-[560px]
              overflow-hidden
              rounded-[30px]
              border
              border-slate-200
              bg-slate-100
              shadow-[0_24px_70px_rgba(15,23,42,0.10)]
              dark:border-slate-800
              dark:bg-slate-950
            "
          >

            {/* ================================================= */}
            {/* СВЕТЛАЯ СЦЕНА */}
            {/* ================================================= */}

   <img
  src="/car-catalog/images/hero-scene-light.png"
  alt=""
  aria-hidden="true"
  className="
    absolute
    inset-0
    z-0
    h-full
    w-full
    object-cover
    object-center
    dark:hidden
  "
/>

            {/* ================================================= */}
            {/* ТЁМНАЯ СЦЕНА */}
            {/* ================================================= */}

   <img
  src="/car-catalog/images/hero-scene-dark.png"
  alt=""
  aria-hidden="true"
  className="
    absolute
    inset-0
    z-0
    h-full
    w-full
    object-cover
    object-center
    dark:block
  "
/>

            {/* ================================================= */}
            {/* ЛЁГКОЕ ЗАТЕМНЕНИЕ СЛЕВА */}
            {/* ================================================= */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                z-[1]
                bg-gradient-to-r
                from-black/55
                via-black/20
                to-transparent
                dark:from-black/60
                dark:via-black/25
                dark:to-transparent
              "
            />

            {/* ================================================= */}
            {/* МЯГКОЕ ЗАТЕМНЕНИЕ СНИЗУ */}
            {/* ================================================= */}

            <div
              className="
                pointer-events-none
                absolute
                inset-x-0
                bottom-0
                z-[1]
                h-[45%]
                bg-gradient-to-t
                from-black/45
                via-black/10
                to-transparent
                dark:from-black/55
              "
            />

            {/* ================================================= */}
            {/* КОНТЕНТ ПОВЕРХ СЦЕНЫ */}
            {/* ================================================= */}

            <div
              className="
                relative
                z-10
                flex
                min-h-[560px]
                flex-col
                justify-between
                px-7
                py-8
                sm:px-10
                sm:py-10
                lg:px-14
                lg:py-12
              "
            >

              {/* ================================================= */}
              {/* ВЕРХНИЙ LABEL */}
              {/* ================================================= */}

              <div>
                <div
                  className="
                    inline-flex
                    items-center
                    gap-3
                    rounded-full
                    border
                    border-white/20
                    bg-black/20
                    px-4
                    py-2
                    backdrop-blur-md
                  "
                >
                  <span
                    className="
                      h-2
                      w-2
                      rounded-full
                      bg-blue-400
                      shadow-[0_0_12px_rgba(96,165,250,0.9)]
                    "
                  />

                  <span
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.28em]
                      text-white
                    "
                  >
                    Современные китайские автомобили
                  </span>
                </div>
              </div>

              {/* ================================================= */}
              {/* НИЖНЯЯ ЧАСТЬ */}
              {/* ================================================= */}

              <div className="max-w-[600px]">

                {/* КНОПКИ */}

                <div
                  className="
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
                      shadow-xl
                      shadow-blue-900/30
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:bg-blue-500
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
                      rounded-xl
                      border
                      border-white/30
                      bg-black/25
                      px-6
                      text-sm
                      font-bold
                      text-white
                      backdrop-blur-md
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:bg-black/40
                    "
                  >
                    По регионам
                  </a>

                </div>

                {/* ================================================= */}
                {/* СТАТИСТИКА */}
                {/* ================================================= */}

                <div
                  className="
                    mt-7
                    flex
                    max-w-[500px]
                    items-center
                    border-t
                    border-white/20
                    pt-5
                  "
                >

                  {/* 40+ */}

                  <div className="pr-7">
                    <div
                      className="
                        text-2xl
                        font-bold
                        tracking-tight
                        text-white
                      "
                    >
                      40+
                    </div>

                    <div
                      className="
                        mt-1
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-white/60
                      "
                    >
                      моделей
                    </div>
                  </div>

                  {/* divider */}

                  <div
                    className="
                      h-9
                      w-px
                      bg-white/20
                    "
                  />

                  {/* 20+ */}

                  <div className="px-7">
                    <div
                      className="
                        text-2xl
                        font-bold
                        tracking-tight
                        text-white
                      "
                    >
                      20+
                    </div>

                    <div
                      className="
                        mt-1
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-white/60
                      "
                    >
                      брендов
                    </div>
                  </div>

                  {/* divider */}

                  <div
                    className="
                      h-9
                      w-px
                      bg-white/20
                    "
                  />

                  {/* 98 */}

                  <div className="pl-7">
                    <div
                      className="
                        text-2xl
                        font-bold
                        tracking-tight
                        text-white
                      "
                    >
                      98
                    </div>

                    <div
                      className="
                        mt-1
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-white/60
                      "
                    >
                      регионов
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </section>

          {/* ================================================= */}
          {/* КАТАЛОГ */}
          {/* ================================================= */}

          <section>

            <div className="mb-7">

              <h2
                className="
                  text-3xl
                  font-semibold
                  tracking-[-0.025em]
                  text-slate-950
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
