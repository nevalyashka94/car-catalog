import Layout from "../layout/Layout";
import { ThemeProvider } from "../context/ThemeContext";
import Catalog from "../components/catalog/Catalog";

export default function Home() {
  return (
    <ThemeProvider>
      <Layout>
        <main className="space-y-14">

          {/* ================================================= */}
          {/* HERO — КИНЕМАТОГРАФИЧЕСКАЯ АВТОМОБИЛЬНАЯ СЦЕНА */}
          {/* ================================================= */}

          <section
            className="
              relative
              min-h-[580px]
              overflow-hidden
              rounded-[36px]
              border
              border-slate-200/80
              bg-slate-950
              shadow-[0_25px_70px_rgba(0,0,0,0.12)]
              transition-all
              duration-500
              dark:border-white/[0.08]
              dark:shadow-[0_35px_100px_rgba(0,0,0,0.8),0_0_50px_rgba(37,99,235,0.15)]
            "
          >

            {/* ДНЕВНАЯ СЦЕНА */}
            <img
              src="/car-catalog/images/hero-scene-light.png"
              alt="Day Scene"
              aria-hidden="true"
              className="
                absolute
                inset-0
                z-0
                h-full
                w-full
                object-cover
                object-center
                transition-opacity
                duration-700
                ease-in-out
                dark:opacity-0
              "
            />

            {/* НОЧНАЯ СЦЕНА (Включается плавно поверх) */}
            <img
              src="/car-catalog/images/hero-scene-dark.png"
              alt="Night Scene"
              aria-hidden="true"
              className="
                absolute
                inset-0
                z-0
                h-full
                w-full
                object-cover
                object-center
                opacity-0
                transition-opacity
                duration-700
                ease-in-out
                dark:opacity-100
              "
            />

            {/* КИНЕМАТОГРАФИЧНОЕ ЗАТЕМНЕНИЕ СЛЕВА (ДЛЯ ЧИТАЕМОСТИ КНОПОК И ТЕКСТА) */}
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                z-[1]
                bg-gradient-to-r
                from-slate-950/75
                via-slate-950/35
                to-transparent
                transition-colors
                duration-500
                dark:from-black/85
                dark:via-black/45
                dark:to-transparent
              "
            />

            {/* МЯГКИЙ ГРАДИЕНТ СНИЗУ ПОД СТАТИСТИКУ */}
            <div
              className="
                pointer-events-none
                absolute
                inset-x-0
                bottom-0
                z-[1]
                h-[45%]
                bg-gradient-to-t
                from-black/75
                via-black/20
                to-transparent
              "
            />

            {/* КОНТЕНТ ПОВЕРХ СЦЕНЫ */}
            <div
              className="
                relative
                z-10
                flex
                min-h-[580px]
                flex-col
                justify-between
                p-8
                sm:p-10
                lg:p-14
              "
            >

              {/* ВЕРХНИЙ БЕЙДЖ */}
              <div>
                <div
                  className="
                    inline-flex
                    items-center
                    gap-2.5
                    rounded-full
                    border
                    border-white/20
                    bg-black/35
                    px-4
                    py-2
                    shadow-lg
                    backdrop-blur-xl
                  "
                >
                  <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_10px_#38bdf8] animate-pulse" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white">
                    Современные китайские автомобили
                  </span>
                </div>
              </div>

              {/* НИЖНИЙ БЛОК: КНОПКИ И СТАТИСТИКА */}
              <div className="max-w-[620px]">

                {/* КНОПКИ ДЕЙСТВИЙ */}
                <div className="flex flex-wrap gap-3.5">
                  <a
                    href="#/"
                    className="
                      inline-flex
                      h-12
                      items-center
                      gap-3
                      rounded-2xl
                      bg-gradient-to-r
                      from-blue-600
                      to-sky-500
                      px-7
                      text-sm
                      font-bold
                      text-white
                      shadow-xl
                      shadow-blue-600/30
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:shadow-blue-600/50
                    "
                  >
                    <span>Смотреть автомобили</span>
                    <span className="text-base">→</span>
                  </a>

                  <a
                    href="#/regions"
                    className="
                      inline-flex
                      h-12
                      items-center
                      rounded-2xl
                      border
                      border-white/20
                      bg-white/10
                      px-7
                      text-sm
                      font-semibold
                      text-white
                      backdrop-blur-xl
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:bg-white/20
                      hover:border-white/30
                    "
                  >
                    По регионам
                  </a>
                </div>

                {/* СТАТИСТИКА */}
                <div className="mt-8 flex max-w-[500px] items-center border-t border-white/15 pt-6">
                  {/* 40+ */}
                  <div className="pr-8">
                    <div className="font-['Space_Grotesk',sans-serif] text-3xl font-extrabold tracking-tight text-white">
                      40+
                    </div>
                    <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">
                      моделей
                    </div>
                  </div>

                  <div className="h-8 w-px bg-white/15" />

                  {/* 20+ */}
                  <div className="px-8">
                    <div className="font-['Space_Grotesk',sans-serif] text-3xl font-extrabold tracking-tight text-white">
                      20+
                    </div>
                    <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">
                      брендов
                    </div>
                  </div>

                  <div className="h-8 w-px bg-white/15" />

                  {/* 98 */}
                  <div className="pl-8">
                    <div className="font-['Space_Grotesk',sans-serif] text-3xl font-extrabold tracking-tight text-white">
                      98
                    </div>
                    <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">
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
            <Catalog />
          </section>

        </main>
      </Layout>
    </ThemeProvider>
  );
}
