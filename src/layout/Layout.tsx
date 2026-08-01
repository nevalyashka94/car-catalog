import { ReactNode } from "react";
import Header from "../components/Header";

interface Props {
    children: ReactNode;
}

export default function Layout({
    children,
}: Props) {
    return (
        <div
            className="
            min-h-screen
            bg-white
            dark:bg-slate-950
            text-slate-900
            dark:text-white
            transition-colors
            "
        >
            <Header />

            <main
                className="
                max-w-7xl
                mx-auto
                px-6
                py-8
                "
            >
                {children}
            </main>
        </div>
    );
}
