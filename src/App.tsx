import Regions from "./pages/Regions";
import ProtectedRoute from "./components/ProtectedRoute";
import { HashRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Brands from "./pages/Brands";
import BrandPage from "./pages/BrandPage";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
<Route path="/regions" element={<Regions />} />
        
        <Route path="/brands" element={<Brands />} />

        <Route
          path="/brands/:id"
          element={<BrandPage />}
        />

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
  );
}
