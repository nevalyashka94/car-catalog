import { useEffect, useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import Regions from "./pages/Regions";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Brands from "./pages/Brands";
import BrandPage from "./pages/BrandPage";

export default function App() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#060709] text-slate-100">
      {/* Фоновые парящие световые сферы */}
      <div 
        className="pointer-events-none fixed -left-28 -top-36 h-[600px] w-[600px] rounded-full opacity-20 blur-[140px]"
        style={{ background: "radial-gradient(circle, #2563eb, transparent 70%)" }}
      />
      <div 
        className="pointer-events-none fixed -right-36 bottom-10 h-[550px] w-[550px] rounded-full opacity-15 blur-[140px]"
        style={{ background: "radial-gradient(circle, #0284c7, transparent 70%)" }}
      />

      {/* Луч, следующий за курсором мыши */}
      <div
        className="pointer-events-none fixed z-50 hidden h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-35 blur-[80px] transition-opacity duration-300 md:block"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.18), transparent 70%)",
        }}
      />

      {/* Основной контент и роутинг */}
      <div className="relative z-10">
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/regions" element={<Regions />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/brands/:id" element={<BrandPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
          </Routes>
        </HashRouter>
      </div>
    </div>
  );
}
