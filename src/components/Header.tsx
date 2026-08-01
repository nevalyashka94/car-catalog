import ThemeSwitcher from "./ThemeSwitcher";

export default function Header() {
    return (
        <header
            className="
            sticky
            top-0
            z-50
            border-b
            bg-white/80
            dark:bg-slate-950/80
            backdrop-blur
            "
        >
            <div
                className="
                max-w-7xl
                mx-auto
                px-6
                h-16
                flex
                items-center
                justify-between
                "
            >
                <h1 className="font-bold text-2xl">
                    🚗 Car Catalog
                </h1>

                <ThemeSwitcher />
            </div>
        </header>
    );
}
