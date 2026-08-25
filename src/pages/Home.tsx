<main className="relative min-h-screen">

        {/* КНОПКА ВОЗВРАТА С ОТСТУПОМ ОТ ФИКСИРОВАННОЙ ШАПКИ */}
        {currentView !== "portal" && (
          <div className="sticky top-24 z-40 mb-6 flex items-center justify-between">
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
                px-5
                py-3
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

        {/* ПОЛНОЭКРАННЫЙ ПОРТАЛ */}
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
          {/* Содержимое портала без изменений */}
          {/* ... */}
        </div>

        {/* СЕКЦИЯ КАТАЛОГА С ОТСТУПОМ ПОД ШАПКУ */}
        <div
          className={`
            transition-all
            duration-700
            ease-in-out
            ${
              currentView === "catalog"
                ? "relative translate-y-0 pt-28 opacity-100"
                : "pointer-events-none absolute inset-x-0 top-0 translate-y-12 opacity-0"
            }
          `}
        >
          {currentView === "catalog" && <Catalog />}
        </div>

        {/* СЕКЦИЯ РЕГИОНОВ С ОТСТУПОМ ПОД ШАПКУ */}
        <div
          className={`
            transition-all
            duration-700
            ease-in-out
            ${
              currentView === "regions"
                ? "relative translate-y-0 pt-28 opacity-100"
                : "pointer-events-none absolute inset-x-0 top-0 translate-y-12 opacity-0"
            }
          `}
        >
          {currentView === "regions" && <Regions />}
        </div>

      </main>
