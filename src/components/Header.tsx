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
        bg-white/90
        backdrop-blur-xl
        dark:border-slate-800
        dark:bg-slate-950/90
      "
    >
      <div
        className="
          mx-auto
          flex
          h-[72px]
          max-w-7xl
          items-center
          justify-between
          px-4
          sm:px-6
        "
      >
        {/* Логотип */}
        <a
          href="#/"
          className="
            flex
            items-center
            gap-2
            text-xl
            font-extrabold
            tracking-tight
            text-slate-950
            transition
            hover:opacity-80
            dark:text-white
            sm:text-2xl
          "
        >
          <span className="text-2xl sm:text-3xl">
            🚗
          </span>

          <span>Car Catalog</span>
        </a>

        {/* Навигация */}
        <nav className="hidden items-center gap-2 md:flex">

          <a
            href="#/"
            className="
              rounded-xl
              px-4
              py-2.5
              text-sm
              font-semibold
              text-slate-600
              transition
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
              px-4
              py-2.5
              text-sm
              font-semibold
              text-slate-600
              transition
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

        {/* Тема */}
        <ThemeSwitcher />
      </div>
    </header>
  );
}
