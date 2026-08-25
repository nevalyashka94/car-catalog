import { useState, useRef, MouseEvent, useMemo, useEffect } from "react";
import Layout from "../layout/Layout";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import Catalog from "../components/catalog/Catalog";
import Regions from "./Regions";

type ActiveView = "portal" | "catalog" | "regions";

function HomeContent() {
  const { theme } = useTheme();
  const [currentView, setCurrentView] = useState<ActiveView>("portal");
  const containerRef = useRef<HTMLDivElement>(null);

  // Стейты параллакса курсора
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [bgOffset, setBgOffset] = useState({ x: 0, y: 0 });

  // Ключ для перезапуска анимации заезда при возврате на главный экран
  const [driveKey, setDriveKey] = useState(0);

  useEffect(() => {
    if (currentView === "portal") {
      setDriveKey((prev) => prev + 1);
    }
  }, [currentView]);

  // Возврат на главный экран по Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCurrentView("portal");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 55 частиц снега
  const snowParticles = useMemo(() => {
    return Array.from({ length: 55 }).map((_, i) => ({
      id: i,
      size: (i % 3) + 2,
      left: `${(i * 1.8) % 100}%`,
      duration: ((i % 5) + 4) * 1.6,
      delay: (i % 7) * 0.7,
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
      x: ((x - centerX) / centerX) * -12,
      y: ((y - centerY) / centerY) * -12,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setBgOffset({ x: 0, y: 0 });
  };

  const isDark = theme === "dark";

  return (
    <Layout>
      {/* СТИЛИ АНИМАЦИИ ВЪЕЗДА И ЗАЖИГАНИЯ ФАР */}
      <style>{`
        @keyframes carArrival {
          0% {
            transform: scale(1.18) translate3d(35px, 20px, 0) rotate(1deg);
            filter: blur(8px) brightness(0.6);
          }
          100% {
            transform: scale(1.04) translate3d(0, 0, 0) rotate(0deg);
            filter: blur(0px) brightness(1);
          }
        }

        @keyframes headlightIgnition {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          40% {
            opacity: 1;
            transform: scale(1.4);
            filter: brightness(2.2);
          }
          60% {
            opacity: 0.7;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
            filter: brightness(1);
          }
        }

        @keyframes snowFallFull {
          0% {
            transform: translateY(-20px) translateX(0);
            opacity: 0;
          }
          20% {
            opacity: 0.9;
          }
          80% {
            opacity: 0.9;
          }
          100% {
            transform: translateY(105vh) translateX(35px);
            opacity: 0;
          }
        }

        .animate-car-drive {
          animation: carArrival 1.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-headlights {
          animation: headlightIgnition 0.9s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
        }
      `}</style>

      <main className="relative min-h-screen">

        {/* КНОПКА ВОЗВРАТА "НАЗАД" */}
        {currentView !== "portal" && (
          <div className="sticky top-6 z-40 mb-8 flex items-center justify-between">
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
                border-slate-200/80
                bg-white/90
                px-6
                py-3.5
                text-xs
                font-bold
                text-slate-900
                shadow-xl
                backdrop-blur-2xl
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
              <span className="rounded-lg bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-500 dark:bg-white/10 dark:text-slate-300">
                ESC
              </span>
            </button>

            <div className="font-mono text-xs font-bold tracking-widest text-slate-400">
              {currentView === "catalog" ? "01 / КАТАЛОГ АВТОМОБИЛЕЙ" : "02 / ПО РЕГИОНАМ"}
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* ПОЛНОЭКРАННЫЙ ПОРТАЛ (HERO SCENE) */}
        {/* ================================================= */}
        <div
          className={`
            transition-all
            duration-700
            ease-in-out
            ${
              currentView === "portal"
                ? "fixed inset-0 z-30 flex h-screen w-screen flex-col justify-between overflow-hidden bg-[#06080d] opacity-100"
                : "pointer-events-none fixed inset-0 z-0 scale-95 opacity-0 blur-md"
            }
          `}
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ perspective: "1300px" }}
        >
          {/* СЦЕНА С ПЛАВНЫМ ВЪЕЗДОМ И ПАРАЛЛАКСОМ */}
          <div
            key={driveKey}
            className="absolute -inset-10 transition-transform duration-300 ease-out animate-car-drive"
            style={{
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.06)`,
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            {/* ДНЕВНАЯ СЦЕНА (ВЫКЛЮЧЕННЫЕ ФАРЫ) */}
            <img
              src="/car-catalog/images/hero-scene-light.png"
              alt="Day Scene"
              aria-hidden="true"
              className={`
                absolute
                inset-0
                h-full
                w-full
                object-cover
                object-center
                transition-opacity
                duration-1000
                ease-in-out
                ${isDark ? "opacity-0" : "opacity-100"}
              `}
              style={{
                transform: `translate3d(${bgOffset.x}px, ${bgOffset.y}px, 0)`,
              }}
            />

            {/* НОЧНАЯ СЦЕНА (ОСНОВНОЙ ФОН) */}
            <img
              src="/car-catalog/images/hero-scene-dark.png"
              alt="Night Scene"
              aria-hidden="true"
              className={`
                absolute
                inset-0
                h-full
                w-full
                object-cover
                object-center
                transition-opacity
                duration-1000
                ease-in-out
                ${isDark ? "opacity-100" : "opacity-0"}
              `}
              style={{
                transform: `translate3d(${bgOffset.x}px, ${bgOffset.y}px, 0)`,
              }}
            />

            {/* ================================================= */}
            {/* ДИНАМИЧЕСКАЯ АНИМАЦИЯ ВКЛЮЧЕНИЯ ФАР В ТЕМНОЙ ТЕМЕ */}
            {/* ================================================= */}
            {isDark && (
              <div
                className="pointer-events-none absolute inset-0 z-[2] animate-headlights"
                style={{
                  transform: `translate3d(${bgOffset.x * 1.1}px, ${bgOffset.y * 1.1}px, 20px)`,
                }}
              >
                {/* 1. Точечные неоновые линзы фар на кузове */}
                <div className="absolute bottom-[36%] left-[34%] h-3 w-7 rounded-full bg-cyan-200 shadow-[0_0_25px_#38bdf8,0_0_50px_#60a5fa]" />
                <div className="absolute bottom-[34.5%] left-[42.5%] h-3 w-7 rounded-full bg-cyan-200 shadow-[0_0_25px_#38bdf8,0_0_50px_#60a5fa]" />

                {/* 2. Объемные конусы света фар вперед на снег */}
                <div
                  className="
                    absolute
                    bottom-[18%]
                    left-[26%]
                    h-56
                    w-[580px]
                    -rotate-[14deg]
                    rounded-full
                    bg-gradient-to-r
                    from-cyan-300/45
                    via-sky-400/20
                    to-transparent
                    blur-[55px]
                  "
                />

                {/* 3. Ореол освещения дороги перед автомобилем */}
                <div
                  className="
                    absolute
                    bottom-[14%]
                    left-[30%]
                    h-40
                    w-[440px]
                    rounded-full
                    bg-sky-400/30
                    blur-[75px]
                  "
                />
              </div>
            )}

            {/* МАССИВНАЯ ТИПОГРАФИКА KAGE НА ЗАДНЕМ ПЛАНЕ */}
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
                transform: `translate3d(${bgOffset.x * -1.8}px, ${bgOffset.y * -1.8}px, -50px)`,
              }}
            >
              <span
                className="
                  font-['Space_Grotesk',sans-serif]
                  text-[18vw]
                  font-black
                  tracking-[0.2em]
                  text-white/[0.08]
                  transition-all
                  duration-700
                  dark:text-white/[0.05]
                "
              >
                CATALOG
              </span>
            </div>

            {/* ЗАТЕМНЯЮЩИЕ КИНЕМАТОГРАФИЧЕСКИЕ ГРАДИЕНТЫ */}
            <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-r from-black/85 via-black/35 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[50%] bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          </div>

          {/* ПАРЯЩИЙ СНЕГОПАД */}
          <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
            {snowParticles.map((p) => (
              <div
                key={p.id}
                className="absolute rounded-full bg-white shadow-[0_0_10px_#38bdf8]"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  left: p.left,
                  top: "-15px",
                  animation: `snowFallFull ${p.duration}s linear infinite`,
                  animationDelay: `-${p.delay}s`,
                }}
              />
            ))}
          </div>

          {/* ВЕРХНЯЯ ЧАСТЬ ЭКРАНА */}
          <div className="relative z-10 flex items-center justify-between p-8 sm:p-12 lg:px-16 lg:py-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-black/40 px-5 py-2.5 shadow-2xl backdrop-blur-2xl">
              <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_10px_#38bdf8] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-white">
                Современные китайские автомобили
              </span>
            </div>

            <div className="hidden font-mono text-xs font-bold tracking-[0.3em] text-slate-400 sm:block">
              KAGE // 2026 EDITION
            </div>
          </div>

          {/* НИЖНЯЯ ЧАСТЬ ЭКРАНА */}
          <div className="relative z-10 max-w-[680px] p-8 sm:p-12 lg:px-16 lg:pb-16">
            
            {/* Кнопки переходов */}
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => setCurrentView("catalog")}
                className="
                  group
                  inline-flex
                  h-14
                  items-center
                  gap-3.5
                  rounded-2xl
                  bg-gradient-to-r
                  from-blue-600
                  to-sky-500
                  px-8
                  text-sm
                  font-extrabold
                  text-white
                  shadow-[0_15px_35px_rgba(37,99,235,0.4)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_20px_45px_rgba(37,99,235,0.6)]
                "
              >
                <span>Смотреть автомобили</span>
                <span className="text-lg transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentView("regions")}
                className="
                  inline-flex
                  h-14
                  items-center
                  rounded-2xl
                  border
                  border-white/20
                  bg-white/10
                  px-8
                  text-sm
                  font-bold
                  text-white
                  shadow-xl
                  backdrop-blur-2xl
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-white/40
                  hover:bg-white/20
                "
              >
                По регионам
              </button>
            </div>

            {/* Статистика */}
            <div className="mt-10 flex max-w-[500px] items-center border-t border-white/15 pt-6">
              <div className="pr-8">
                <div className="font-['Space_Grotesk',sans-serif] text-3xl font-extrabold text-white">
                  40+
                </div>
                <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  моделей
                </div>
              </div>
              <div className="h-8 w-px bg-white/15" />
              <div className="px-8">
                <div className="font-['Space_Grotesk',sans-serif] text-3xl font-extrabold text-white">
                  20+
                </div>
                <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  брендов
                </div>
              </div>
              <div className="h-8 w-px bg-white/15" />
              <div className="pl-8">
                <div className="font-['Space_Grotesk',sans-serif] text-3xl font-extrabold text-white">
                  98
                </div>
                <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  регионов
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ================================================= */}
        {/* СЕКЦИЯ 1: КАТАЛОГ */}
        {/* ================================================= */}
        <div
          className={`
            transition-all
            duration-700
            ease-in-out
            ${
              currentView === "catalog"
                ? "relative translate-y-0 opacity-100"
                : "pointer-events-none absolute inset-x-0 top-0 translate-y-12 opacity-0"
            }
          `}
        >
          {currentView === "catalog" && <Catalog />}
        </div>

        {/* ================================================= */}
        {/* СЕКЦИЯ 2: РЕГИОНЫ */}
        {/* ================================================= */}
        <div
          className={`
            transition-all
            duration-700
            ease-in-out
            ${
              currentView === "regions"
                ? "relative translate-y-0 opacity-100"
                : "pointer-events-none absolute inset-x-0 top-0 translate-y-12 opacity-0"
            }
          `}
        >
          {currentView === "regions" && <Regions />}
        </div>

      </main>
    </Layout>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <HomeContent />
    </ThemeProvider>
  );
}
