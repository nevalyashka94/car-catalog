import { useState, useRef, MouseEvent, useMemo, useEffect } from "react";
import Layout from "../layout/Layout";
import { ThemeProvider } from "../context/ThemeContext";
import Catalog from "../components/catalog/Catalog";
import Regions from "./Regions";

type ActiveView = "portal" | "catalog" | "regions";

export default function Home() {
  const [currentView, setCurrentView] = useState<ActiveView>("portal");
  const containerRef = useRef<HTMLDivElement>(null);

  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [bgOffset, setBgOffset] = useState({ x: 0, y: 0 });

  // Возврат на главный экран по клавише Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCurrentView("portal");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const snowParticles = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      size: (i % 3) + 2,
      left: `${(i * 2.2) % 100}%`,
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

    setRotateX(((y - centerY) / centerY) * -3.5);
    setRotateY(((x - centerX) / centerX) * 3.5);
    setBgOffset({
      x: ((x - centerX) / centerX) * -10,
      y: ((y - centerY) / centerY) * -10
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
              transform: translateY(680px) translateX(20px);
              opacity: 0;
            }
          }
        `}</style>

        <main className="relative min-h-[85vh] space-y-8">

          {/* КНОПКА "НАЗАД В МЕНЮ" */}
          {currentView !== "portal" && (
            <div className="sticky top-4 z-40 flex items-center justify-between">
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
                  bg-white/90
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
                  dark:bg-[#0c1017]/90
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
                bg-[#07090e]
                shadow-[0_30px_90px_rgba(0,0,0,0.15)]
                transition-all
                duration-500
                dark:border-white/[0.08]
                dark:shadow-[0_40px_100px_rgba(0,0,0,0.9)]
              "
              style={{ perspective: "1200px" }}
            >
              {/* 3D СЛОЙ */}
              <div
                className="absolute -inset-6 transition-transform duration-300 ease-out"
                style={{
                  transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.06)`,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden"
                }}
              >
                {/* ДНЕВНАЯ СЦЕНА */}
                <img
                  src="/car-catalog/images/hero-scene-light.png"
                  alt=""
                  aria-hidden="true"
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    scale-105
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
                  src="/car-catalog/images/hero-scene-dark.png"
                  alt=""
                  aria-hidden="true"
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    scale-105
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

                {/* ФОНОВЫЙ ТЕКСТ В СТИЛЕ KAGE */}
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
                    transform: `translate3d(${bgOffset.x * -1.5}px, ${bgOffset.y * -1.5}px, -40px)`
                  }}
                >
                  <span
                    className="
                      text-[15vw]
                      font-black
                      tracking-[0.18em]
                      text-white/[0.08]
                      transition-all
                      duration-700
                      dark:text-white/[0.05]
                    "
                  >
                    CATALOG
                  </span>
                </div>

                {/* НЕОНОВЫЙ СВЕТ */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    bottom-[25%]
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

                {/* ЗАТЕМНЯЮЩИЕ ГРАДИЕНТЫ */}
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
                <div>
                  <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-black/40 px-4 py-2 shadow-lg backdrop-blur-xl">
                    <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_10px_#38bdf8] animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white">
                      Современные китайские автомобили
                    </span>
                  </div>
                </div>

                {/* Нижний блок: Кнопки и статистика */}
                <div className="max-w-[620px]">
                  <div className="flex flex-wrap gap-3.5">
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
                        40+
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                        моделей
                      </div>
                    </div>
                    <div className="h-7 w-px bg-white/15" />
                    <div className="px-7">
                      <div className="font-['Space_Grotesk',sans-serif] text-2xl font-extrabold text-white">
                        20+
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                        брендов
                      </div>
                    </div>
                    <div className="h-7 w-px bg-white/15" />
                    <div className="pl-7">
                      <div className="font-['Space_Grotesk',sans-serif] text-2xl font-extrabold text-white">
                        98
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                        регионов
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>
          </div>

          {/* ================================================= */}
          {/* ЭКРАН 1: КАТАЛОГ АВТОМОБИЛЕЙ */}
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
          {/* ЭКРАН 2: АВТО ПО РЕГИОНАМ */}
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
            {currentView === "regions" && <Regions />}
          </div>

        </main>
      </Layout>
    </ThemeProvider>
  );
}
