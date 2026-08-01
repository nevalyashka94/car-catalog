import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeSwitcher() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            px-4
            py-2
            hover:bg-slate-100
            dark:hover:bg-slate-800
            transition
            "
        >
            {theme === "light" ? (
                <>
                    <Moon size={18} />
                    Темная
                </>
            ) : (
                <>
                    <Sun size={18} />
                    Светлая
                </>
            )}
        </button>
    );
}
