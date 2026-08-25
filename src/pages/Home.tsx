import { useState, useRef, MouseEvent, useMemo } from "react";
import Layout from "../layout/Layout";
import { ThemeProvider } from "../context/ThemeContext";
import Catalog from "../components/catalog/Catalog";

interface Slide {
  id: string;
  num: string;
  tag: string;
  title: string;
  subtitle: string;
  bigText: string;
  lightImg: string;
  darkImg: string;
  specs: { models: string; brands: string; regions: string };
}

const SLIDES: Slide[] = [
  {
    id: "zeekr-7x",
    num: "01",
    tag: "ФЛАГМАНСКИЙ КРОССОВЕР",
    title: "ZEEKR 7X",
    subtitle: "Безупречная аэродинамика, интеллектуальный полный привод и премиальный комфорт.",
    bigText: "ZEEKR",
    lightImg: "/car-catalog/images/hero-scene-light.png",
    darkImg: "/car-catalog/images/hero-scene-dark.png",
    specs: { models: "40+", brands: "20+", regions: "98" }
  },
  {
    id: "li-l9",
    num: "02",
    tag: "ПРЕМИАЛЬНЫЙ SUV",
    title: "LI AUTO L9",
    subtitle: "Пространство первого класса и запас хода свыше 1300 км в гибридном цикле.",
    bigText: "LIAUTO",
    lightImg: "/car-catalog/images/hero-scene-light.png",
    darkImg: "/car-catalog/images/hero-scene-dark.png",
    specs: { models: "40+", brands: "20+", regions: "98" }
  },
  {
    id: "voyah-free",
    num: "03",
    tag: "СПОРТ-КРОССОВЕР",
    title: "VOYAH FREE",
    subtitle: "Пневмоподвеска, динамика спорткара и интеллектуальный автопилот.",
    bigText: "VOYAH",
    lightImg: "/car-catalog/images/hero-scene-light.png",
    darkImg: "/car-catalog/images/hero-scene-dark.png",
    specs: { models: "40+", brands: "20+", regions: "98" }
  },
  {
    id: "avatr-11",
    num: "04",
    tag: "ЭЛЕКТРИЧЕСКИЙ КУПЕ-SUV",
    title: "AVATR 11",
    subtitle: "Футуристичный дизайн, архитектура Huawei Inside и матричная оптика.",
    bigText: "AVATR",
    lightImg: "/car-catalog/images/hero-scene-light.png",
    darkImg: "/car-catalog/images/hero-scene-dark.png",
    specs: { models: "40+", brands: "20+", regions: "98" }
  }
];

type ActiveView = "portal" | "catalog" | "regions";

export default function Home() {
  const [currentView, setCurrentView] = useState<ActiveView>("portal");
  const [activeIdx, setActiveIdx] = useState(0);
  const activeSlide = SLIDES[activeIdx];
  const containerRef = useRef<HTMLDivElement>(null);

  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [bgOffset, setBgOffset] = useState({ x: 0, y: 0 });

  // 50 частиц снега
  const snowParticles = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      size: (i % 3) + 2,
      left: `${(i * 2) % 100}%`,
      duration: ((i % 5) + 4) * 1.5,
      delay: (i % 7) * 0.8,
    }));
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || currentView !== "portal") return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setRotateX(((y - centerY) / centerY) * -5);
    setRotateY(((x - centerX) / centerX) * 5);
    setBgOffset({
      x: ((x - centerX) / centerX) * -15,
      y: ((y - centerY) / centerY) * -15
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setBgOffset({ x: 0, y: 0 });
  };

  return (
    <ThemeProvider>
      <Layout>
        <style>{`
          @keyframes snowFall {
            0% {
              transform: translateY(-20px) translateX(0);
              opacity: 0;
            }
            15% {
              opacity: 0.85;
            }
            85% {
              opacity: 0.85;
            }
            100% {
              transform: translateY(700px) translateX(25px);
              opacity: 0;
            }
          }
        `}</style>

        <main className="relative min-h-[85vh] overflow-hidden">

          {/* ================================================= */}
          {/* ВЕРХНЯЯ КНОПКА ВОЗВРАТА "НАЗАД В МЕНЮ" (KAGE-STYLE) */}
          {/* ================================================= */}
          {currentView !== "portal" && (
            <div className="sticky top-4 z-40 mb-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentView("portal")}
                className="
                  group
                  inline-flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white/80
                  px-5
                  py-3
                  text-xs
                  font-bold
                  text-slate-900
                  shadow-xl
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:-translate-x-1
                  hover:border-blue-500
                  dark:border-white/10
                  dark:bg-[#0c1017]/80
                  dark:text-white
                  dark:hover:border-sky-400
                "
              >
                <span className="text-base transition-transform group-hover:-translate-x-1">←</span>
                <span>Главный экран</span>
                <span className="rounded-lg bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-500 dark:bg-white/10 dark:text-slate-300">ESC</span>
              </button>

              <div className="font-mono text-xs font-bold tracking-widest text-slate-400">
                {currentView === "catalog" ? "01 / КАТАЛОГ АВТОМОБИЛЕЙ" : "02 / ПО РЕГИОНАМ"}
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* ГЛАВНЫЙ 3D HERO ЭКРАН (ПОРТАЛ) */}
          {/* ================================================= */}
          <div
            className={`
              transition-all
              duration-700
              ease-in-out
              ${
                currentView === "portal"
                  ? "relative scale-100 opacity-100"
                  : "pointer-events-none absolute inset-0 -translate-y-12 scale-95 opacity-0 blur-md"
              }
            `}
          >
            <section
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="
                relative
                min-h-[640px]
                w-full
                overflow-hidden
                rounded-[36px]
                border
                border-slate-200/80
                bg-black
                shadow-[0_30px_90px_rgba(0,0,0,0.15)]
                transition-all
                duration-500
                dark:border-white/[0.08]
                dark:shadow-[0_40px_100px_rgba(0,0,0,0.9)]
              "
              style={{ perspective: "1200px" }}
            >
              {/* 3D-ТРАНСФОРМИРУЕМЫЙ СЛОЙ */}
              <div
                className="absolute inset-0 transition-transform duration-300 ease-out"
                style={{
                  transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
                }}
              >
                {/* ДНЕВНАЯ СЦЕНА */}
                <img
                  src={activeSlide.lightImg}
                  alt=""
                  aria-hidden="true"
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    object-center
                    transition-all
                    duration-700
                    ease-in-out
                    dark:opacity-0
                  "
                  style={{
                    transform: `translate3d(${bgOffset.x}px, ${bgOffset.y}px, 0)`
                  }}
                />

                {/* НОЧНАЯ СЦЕНА */}
                <img
                  src={activeSlide.darkImg}
                  alt=""
                  aria-hidden="true"
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    object-center
                    opacity-0
                    transition-all
                    duration-700
                    ease-in-out
                    dark:opacity-100
                  "
                  style={{
                    transform: `translate3d(${bgOffset.x}px, ${bgOffset.y}px, 0)`
                  }}
                />

                {/* ТИПОГРАФИКА KAGE */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    select-none
                  "
                  style={{
                    transform: `translate3d(${bgOffset.x * -1.8}px, ${bgOffset.y * -1.8}px, -60px)`
                  }}
                >
                  <span
                    className="
                      text-[18vw]
                      font-black
                      tracking-[0.18em]
                      text-white/[0.08]
                      transition-all
                      duration-700
                      dark:text-white/[0.05]
                    "
                  >
                    {activeSlide.bigText}
                  </span>
                </div>

                {/* НЕОНОВЫЙ ОРЕОЛ СВЕТА */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    bottom-[24%]
                    left-[20%]
                    z-[1]
                    hidden
                    h-52
                    w-96
                    rounded-full
                    bg-sky-400/20
                    blur-[100px]
                    dark:block
                  "
                />

                {/* ЗАТЕМНЕНИЕ ДЛЯ ЧИТАЕМОСТИ */}
                <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[55%] bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              </div>

              {/* ЧАСТИЦЫ СНЕГА */}
              <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
                {snowParticles.map((p) => (
                  <div
                    key={p.id}
                    className="absolute rounded-full bg-white shadow-[0_0_8px_#38bdf8]"
                    style={{
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                      left: p.left,
                      top: "-10px",
                      animation: `snowFall ${p.duration}s linear infinite`,
                      animationDelay: `-${p.delay}s`,
                    }}
                  />
                ))}
              </div>

              {/* КОНТЕНТ ПОВЕРХ 3D-СЦЕНЫ */}
              <div className="relative z-10 flex min-h-[640px] flex-col justify-between p-8 sm:p-12 lg:p-14">
                
                {/* Верхний бейдж */}
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-black/40 px-4 py-2 shadow-lg backdrop-blur-xl">
                    <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_10px_#38bdf8] animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white">
                      {activeSlide.tag}
                    </span>
                  </div>

                  <div className="hidden items-center gap-3 text-xs font-mono font-bold tracking-widest text-slate-400 sm:flex">
                    <span>PORTAL</span>
                    <span className="text-white">{activeSlide.num}</span>
                    <span>/</span>
                    <span>04</span>
                  </div>
                </div>

                {/* Нижняя часть */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
                  <div className="lg:col-span-8 max-w-[620px]">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                      {activeSlide.title}
                    </h1>
                    <p className="mt-3 text-sm text-slate-300 sm:text-base">
                      {activeSlide.subtitle}
                    </p>

                    {/* Кнопки переключения на разделы */}
                    <div className="mt-7 flex flex-wrap gap-3.5">
                      <button
                        type="button"
                        onClick={() => setCurrentView("catalog")}
                        className="
                          group
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
                        <span className="text-base transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCurrentView("regions")}
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
                      </button>
                    </div>

                    {/* Статистика */}
                    <div className="mt-8 flex max-w-[480px] items-center border-t border-white/15 pt-5">
                      <div className="pr-7">
                        <div className="font-['Space_Grotesk',sans-serif] text-2xl font-extrabold text-white">
                          {activeSlide.specs.models}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                          моделей
                        </div>
                      </div>
                      <div className="h-7 w-px bg-white/15" />
                      <div className="px-7">
                        <div className="font-['Space_Grotesk',sans-serif] text-2xl font-extrabold text-white">
                          {activeSlide.specs.brands}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                          брендов
                        </div>
                      </div>
                      <div className="h-7 w-px bg-white/15" />
                      <div className="pl-7">
                        <div className="font-['Space_Grotesk',sans-serif] text-2xl font-extrabold text-white">
                          {activeSlide.specs.regions}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                          регионов
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Табы слайдера 01..04 */}
                  <div className="lg:col-span-4 flex items-center gap-3 lg:justify-end">
                    {SLIDES.map((slide, idx) => (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => setActiveIdx(idx)}
                        className={`
                          group
                          relative
                          flex
                          h-12
                          w-14
                          items-center
                          justify-center
                          rounded-2xl
                          border
                          transition-all
                          duration-300
                          ${
                            activeIdx === idx
                              ? "border-sky-400 bg-sky-500/20 text-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.3)] backdrop-blur-xl"
                              : "border-white/10 bg-black/40 text-slate-500 hover:border-white/30 hover:text-white backdrop-blur-md"
                          }
                        `}
                      >
                        <span className="font-mono text-sm font-bold tracking-wider">
                          {slide.num}
                        </span>
                        {activeIdx === idx && (
                          <span className="absolute -bottom-1.5 h-1 w-4 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ================================================= */}
          {/* ЭКРАН 1: КАТАЛОГ АВТОМОБИЛЕЙ С ПЛАВНЫМ ПОЯВЛЕНИЕМ */}
          {/* ================================================= */}
          <div
            className={`
              transition-all
              duration-700
              ease-in-out
              ${
                currentView === "catalog"
                  ? "relative translate-y-0 opacity-100"
                  : "pointer-events-none absolute inset-x-0 top-0 translate-y-10 opacity-0"
              }
            `}
          >
            {currentView === "catalog" && <Catalog />}
          </div>

          {/* ================================================= */}
          {/* ЭКРАН 2: АВТО ПО РЕГИОНАМ С ПЛАВНЫМ ПОЯВЛЕНИЕМ */}
          {/* ================================================= */}
          <div
            className={`
              transition-all
              duration-700
              ease-in-out
              ${
                currentView === "regions"
                  ? "relative translate-y-0 opacity-100"
                  : "pointer-events-none absolute inset-x-0 top-0 translate-y-10 opacity-0"
              }
            `}
          >
            {currentView === "regions" && (
              <div className="rounded-[36px] border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-white/10 dark:bg-[#0c1017]/90 sm:p-14">
                <div className="mx-auto max-w-xl">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-600/10 text-3xl text-blue-500 dark:bg-sky-500/10 dark:text-sky-400">
                    📍
                  </div>
                  <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Автомобили по регионам РФ
                  </h2>
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                    Выберите ваш город или федеральный округ для просмотра доступных автомобилей в наличии у официальных дилеров.
                  </p>
                  
                  <div className="mt-8 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setCurrentView("catalog")}
                      className="rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 px-8 py-3.5 text-xs font-bold text-white shadow-xl shadow-blue-500/30 transition-all hover:opacity-90"
                    >
                      Перейти ко всем моделям
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </main>
      </Layout>
    </ThemeProvider>
  );
}
