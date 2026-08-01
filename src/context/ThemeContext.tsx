import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    ReactNode
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [theme, setTheme] = useState<Theme>("light");

    useEffect(() => {
        const saved = localStorage.getItem("theme") as Theme | null;

        if (saved) {
            setTheme(saved);
            document.documentElement.classList.toggle(
                "dark",
                saved === "dark"
            );
        }
    }, []);

    const toggleTheme = () => {
        const next = theme === "light" ? "dark" : "light";

        setTheme(next);

        localStorage.setItem("theme", next);

        document.documentElement.classList.toggle(
            "dark",
            next === "dark"
        );
    };

    const value = useMemo(
        () => ({
            theme,
            toggleTheme,
        }),
        [theme]
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("ThemeProvider отсутствует.");
    }

    return context;
}
