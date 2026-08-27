import { useState, useMemo, useEffect } from "react";
import { Car } from "../../types/car";
import { loadCatalog } from "../../services/catalog";
import CatalogCard from "./CatalogCard";
import Filters from "./Filters";
import { CatalogFilterState } from "../ai/CatAssistant";

interface CatalogProps {
  initialFilters?: CatalogFilterState;
}

const PRICE_PRESETS = [
  "До 2 млн ₽",
  "2–3 млн ₽",
  "3–4 млн ₽",
  "4–5 млн ₽",
  "5+ млн ₽",
];

export default function Catalog({ initialFilters }: CatalogProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // Фильтры
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedBody, setSelectedBody] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [minPriceInput, setMinPriceInput] = useState<string>("");
  const [maxPriceInput, setMaxPriceInput] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    loadCatalog()
      .then((data) => setCars(data))
      .finally(() => setLoading(false));
  }, []);

  // Синхронизация с командами AI кота
  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.brand) setSelectedBrand(initialFilters.brand);
      if (initialFilters.body) setSelectedBody(initialFilters.body);
      if (initialFilters.searchQuery) setSearchTerm(initialFilters.searchQuery);

      if (initialFilters.minPrice) setMinPriceInput(String(initialFilters.minPrice));
      if (initialFilters.maxPrice) setMaxPriceInput(String(initialFilters.maxPrice));
      if (initialFilters.minPrice || initialFilters.maxPrice) setSelectedPrice("");
    }
  }, [initialFilters]);

  const brandsList = useMemo(() => {
    const set = new Set(cars.map((c) => c.brand?.name).filter(Boolean) as string[]);
    return Array.from(set).sort();
  }, [cars]);

  const bodiesList = useMemo(() => {
    const set = new Set(cars.map((c) => c.body).filter(Boolean) as string[]);
    return Array.from(set).sort();
  }, [cars]);

  // Фильтрация
  const filteredCars = useMemo(() => {
    const minVal = minPriceInput ? parseFloat(minPriceInput) : null;
    const maxVal = maxPriceInput ? parseFloat(maxPriceInput) : null;

    return cars.filter((car) => {
      // 1. Поиск по строке
      if (searchTerm.trim()) {
        const full = `${car.brand?.name || ""} ${car.model || ""}`.toLowerCase();
        if (!full.includes(searchTerm.toLowerCase().trim())) return false;
      }

      // 2. Бренд
      if (selectedBrand) {
        const bName = car.brand?.name?.toLowerCase() || "";
        if (!bName.includes(selectedBrand.toLowerCase())) return false;
      }

      // 3. Кузов
      if (selectedBody) {
        const bBody = car.body?.toLowerCase() || "";
        if (!bBody.includes(selectedBody.toLowerCase())) return false;
      }

      // 4. Пресет цены
      const carPrice = car.priceFrom || car.priceTo || 0;
      if (selectedPrice && carPrice > 0) {
        if (selectedPrice === "До 2 млн ₽" && carPrice > 2000000) return false;
        if (selectedPrice === "2–3 млн ₽" && (carPrice < 2000000 || carPrice > 3000000)) return false;
        if (selectedPrice === "3–4 млн ₽" && (carPrice < 3000000 || carPrice > 4000000)) return false;
        if (selectedPrice === "4–5 млн ₽" && (carPrice < 4000000 || carPrice > 5000000)) return false;
        if (selectedPrice === "5+ млн ₽" && carPrice < 5000000) return false;
      }

      // 5. Точный диапазон цен
      if (carPrice > 0) {
        if (minVal !== null && carPrice < minVal) return false;
        if (maxVal !== null && carPrice > maxVal) return false;
      }

      return true;
    });
  }, [cars, searchTerm, selectedBrand, selectedBody, selectedPrice, minPriceInput, maxPriceInput]);

  if (loading) {
    return (
      <div className="py-24 text-center font-bold text-slate-500">
        Загрузка каталога...
      </div>
    );
  }

  return (
    <div>
      <Filters
        brands={brandsList}
        bodies={bodiesList}
        prices={PRICE_PRESETS}
        selectedBrand={selectedBrand}
        selectedBody={selectedBody}
        selectedPrice={selectedPrice}
        minPriceInput={minPriceInput}
        maxPriceInput={maxPriceInput}
        searchTerm={searchTerm}
        onBrandChange={setSelectedBrand}
        onBodyChange={setSelectedBody}
        onPriceChange={setSelectedPrice}
        onMinPriceChange={setMinPriceInput}
        onMaxPriceChange={setMaxPriceInput}
        onSearchChange={setSearchTerm}
      />

      <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
        <span>Найдено автомобилей: <b className="text-white">{filteredCars.length}</b></span>
      </div>

      {filteredCars.length > 0 ? (
        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {filteredCars.map((car) => (
            <CatalogCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-white/10 p-16 text-center text-sm font-medium text-slate-400">
          По заданным параметрам автомобили не найдены. Попробуйте сбросить фильтры.
        </div>
      )}
    </div>
  );
}
