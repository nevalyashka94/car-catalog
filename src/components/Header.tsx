import ThemeSwitcher from "./ThemeSwitcher";

export default function Header() {
  return (
    <header
      className="
        sticky
        top-0
        z-50
        border-b
        border-slate-200/80
        bg-white/95
        backdrop-blur-xl
        dark:border-slate-800
        dark:bg-slate-950/95
      "
    >
      <div
        className="
          mx-auto
          flex
          h-[78px]
          max-w-7xl
          items-center
          justify-between
          px-4
          sm:px-6
        "
      >

        {/* ===================================== */}
        {/* ЛОГОТИП */}
        {/* ===================================== */}

        <a
          href="#/"
          className="
            group
            flex
            items-center
            gap-3
            transition-opacity
            duration-200
            hover:opacity-80
          "
        >

          {/* Знак Car Catalog */}

          <div
            className="
              relative
              flex
              h-10
              w-10
              items-center
              justify-center
            "
            aria-hidden="true"
          >
            {/* Большая буква C */}

            <div
              className="
                absolute
                h-8
                w-8
                rounded-full
                border-[4px]
                border-slate-900
                border-r-transparent
                rotate-[-35deg]
                dark:border-white
                dark:border-r-transparent
              "
            />

            {/* Внутренняя линия */}

            <div
              className="
                absolute
                left-[14px]
                top-[12px]
                h-[4px]
                w-[18px]
                rounded-full
                bg-blue-600
                transition-all
                duration-200
                group-hover:w-[21px]
                dark:bg-blue-400
              "
            />

            {/* Нижняя синяя линия */}

            <div
              className="
                absolute
                bottom-[8px]
                left-[14px]
                h-[4px]
                w-[13px]
                rounded-full
                bg-blue-600
                dark:bg-blue-400
              "
            />
          </div>

          {/* Название */}

          <div
            className="
              flex
              items-baseline
              gap-2
              whitespace-nowrap
            "
          >
            <span
              className="
                text-[22px]
                font-extrabold
                tracking-[0.08em]
                text-slate-950
                dark:text-white
              "
            >
              CAR
            </span>

            <span
              className="
                text-[22px]
                font-extrabold
                tracking-[0.08em]
                text-blue-600
                dark:text-blue-400
              "
            >
              CATALOG
            </span>
          </div>

        </a>

        {/* ===================================== */}
        {/* НАВИГАЦИЯ */}
        {/* ===================================== */}

        <nav className="hidden items-center gap-1 md:flex">

          <a
            href="#/"
            className="
              rounded-xl
              px-5
              py-2.5
              text-sm
              font-semibold
              text-slate-600
              transition-all
              duration-200
              hover:bg-slate-100
              hover:text-slate-950
              dark:text-slate-300
              dark:hover:bg-slate-800
              dark:hover:text-white
            "
          >
            Каталог
          </a>

          <a
            href="#/regions"
            className="
              rounded-xl
              px-5
              py-2.5
              text-sm
              font-semibold
              text-slate-600
              transition-all
              duration-200
              hover:bg-slate-100
              hover:text-slate-950
              dark:text-slate-300
              dark:hover:bg-slate-800
              dark:hover:text-white
            "
          >
            Автомобили по регионам
          </a>

        </nav>

        {/* ===================================== */}
        {/* ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ */}
        {/* ===================================== */}

        <ThemeSwitcher />

      </div>
    </header>
  );
}
