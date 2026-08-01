import { ReactNode } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

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
      flex
      flex-col
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
        flex-1
        max-w-7xl
        mx-auto
        w-full
        px-6
        py-10
        "
      >
        {children}
      </main>

      <Footer />
    </div>
  );
}
