import ThemeSwitcher from "./ThemeSwitcher";

export default function Header() {
  return (
    <header
      className="
        sticky
        top-0
        z-50
        border-b
        border-white/[0.08]
        bg-white/80
        backdrop-blur-2xl
        transition-colors
        duration-300
        dark:border-white/[0.07]
        dark:bg-[#060709]/80
      "
    >
      <div
        className="
          mx-auto
          flex
          h-20
          max-w-7xl
          items-center
          justify-between
          px-4
          sm:px-8
        "
      >
        {/* ЛОГОТИП */}
        <a
          href="#/"
          className="
            group
            flex
            items-center
            gap-3.5
            text-decoration-none
          "
        >
          {/* Неоновая иконка логотипа */}
          <div
            className="
              relative
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-2xl
              border
              border-blue-500/30
              bg-gradient-to-br
              from-blue-500/20
              to-indigo-500/10
              shadow-lg
              shadow-blue-500/15
              transition-all
              duration-300
              group-hover:scale-105
              group-hover:border-blue-500/60
              group-hover:shadow-blue-500/30
            "
          >
            {/* Большая буква C */}
            <div
              className="
                absolute
                h-7
                w-7
                rotate-[-35deg]
                rounded-full
                border-[3.5px]
                border-slate-900
                border-r-transparent
                dark:border-white
                dark:border-r-transparent
              "
            />
            {/* Внутренняя линия */}
            <div
              className="
                absolute
                left-[15px]
                top-[13px]
                h-[3px]
                w-[15px]
                rounded-full
                bg-blue-500
                transition-all
                duration-300
                group-hover:w-[18px]
              "
            />
            {/* Нижняя линия */}
            <div
              className="
                absolute
                bottom-[10px]
                left-[15px]
                h-[3px]
                w-[11px]
                rounded-full
                bg-blue-500
              "
            />
          </div>

          {/* Название */}
          <div className="flex items-baseline gap-1.5 tracking-wider">
            <span className="font-['Space_Grotesk',sans-serif] text-xl font-extrabold tracking-widest text-slate-950 dark:text-white">
              CAR
            </span>
            <span className="bg-gradient-to-r from-blue-500 to-sky-400 bg-clip-text font-['Space_Grotesk',sans-serif] text-xl font-extrabold tracking-widest text-transparent">
              CATALOG
            </span>
          </div>
        </a>

        {/* НАВИГАЦИЯ */}
        <nav className="hidden items-center gap-2 rounded-full border border-white/[0.08] bg-slate-900/[0.03] p-1.5 backdrop-blur-md dark:border-white/[0.06] dark:bg-white/[0.03] md:flex">
          <a
            href="#/"
            className="
              relative
              rounded-full
              px-5
              py-2
              text-sm
              font-semibold
              text-slate-900
              transition-all
              duration-200
              hover:text-blue-600
              dark:text-white
              dark:hover:text-sky-400
            "
          >
            Каталог
          </a>

          <a
            href="#/regions"
            className="
              rounded-full
              px-5
              py-2
              text-sm
              font-medium
              text-slate-500
              transition-all
              duration-200
              hover:text-slate-900
              dark:text-slate-400
              dark:hover:text-white
            "
          >
            Автомобили по регионам
          </a>
        </nav>

        {/* ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ */}
        <div className="flex items-center">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
