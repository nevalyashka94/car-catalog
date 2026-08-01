interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="Поиск по бренду или модели..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full
        rounded-xl
        border
        border-slate-300
        dark:border-slate-700
        bg-white
        dark:bg-slate-900
        px-4
        py-3
        text-base
        outline-none
        focus:ring-2
        focus:ring-blue-500
      "
    />
  );
}