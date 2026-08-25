import { useTheme } from "../context/ThemeContext";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed inset-x-0 top-0 z-50 transition-all duration-300">
      {/* Стеклянная матовая подложка с мягким градиентом и размытием */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent backdrop-blur-md pointer-events-none dark:from-black/80" />

      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-8 lg:px-12">
        
        {/* Логотип */}
        <a
          href="#/"
          className="group flex items-center gap-3.5 transition-transform duration-300 hover:scale-[1.02]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-tr from-blue-600 to-sky-400 font-bold text-white shadow-[0_0_20px_rgba(56,189,248,0.35)] backdrop-blur-xl transition-shadow duration-300 group-hover:shadow-[0_0_25px_rgba(56,189,248,0.55)]">
            C
          </div>
          <span className="font-['Space_Grotesk',sans-serif] text-xl font-extrabold tracking-wider text-white">
            CAR<span className="text-sky-400">.</span>CATALOG
          </span>
        </a>

        {/* Переключатель темы (Glassmorphism) */}
        <button
          type="button"
          onClick={toggleTheme}
          className="
            group
            inline-flex
            items-center
            gap-2.5
            rounded-2xl
            border
            border-white/15
            bg-white/10
            px-4
            py-2.5
            text-xs
            font-bold
            text-white
            shadow-lg
            backdrop-blur-xl
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:border-white/30
            hover:bg-white/20
            hover:shadow-white/5
          "
        >
          <span className="transition-transform duration-300 group-hover:rotate-12">
            {theme === "dark" ? "☀️" : "🌙"}
          </span>
          <span className="tracking-wide">
            {theme === "dark" ? "Светлая" : "Темная"}
          </span>
        </button>

      </div>
    </header>
  );
}
