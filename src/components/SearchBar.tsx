interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  return (
    <div className="relative">
      {/* Иконка поиска */}
      <div
        className="
          pointer-events-none
          absolute
          left-5
          top-1/2
          -translate-y-1/2
          text-slate-400
          dark:text-slate-500
        "
      >
        <svg
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      </div>

      <input
        type="text"
        placeholder="Поиск по бренду или модели..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          rounded-2xl
          border
          border-slate-200
          bg-white
          px-5
          py-4
          pl-13
          text-base
          font-medium
          text-slate-900
          shadow-sm
          outline-none
          transition-all
          placeholder:text-slate-400
          hover:border-slate-300
          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-500/10
          dark:border-slate-800
          dark:bg-slate-900
          dark:text-white
          dark:placeholder:text-slate-500
          dark:hover:border-slate-700
          dark:focus:border-blue-500
          dark:focus:ring-blue-500/10
        "
      />
    </div>
  );
}
