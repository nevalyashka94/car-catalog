import { useMemo, useState } from "react";

import Layout from "./layout/Layout";
import { ThemeProvider } from "./context/ThemeContext";

import SearchBar from "./components/SearchBar";
import Filters from "./components/Filters";
import CarCard from "./components/CarCard";

import cars from "./data/cars.json";

export default function App() {

  const [search, setSearch] = useState("");

  const [brand, setBrand] = useState("");

  const [body, setBody] = useState("");

  const [price, setPrice] = useState("");

  const brands = [...new Set(cars.map(car => car.brand))];

  const bodies = [...new Set(cars.map(car => car.body))];

  const prices = [
    "До 2 млн",
    "2–3 млн",
    "3–4 млн",
    "4–5 млн",
    "5+ млн"
  ];

  function priceCategory(value: number) {

    if (value < 2_000_000)
      return "До 2 млн";

    if (value < 3_000_000)
      return "2–3 млн";

    if (value < 4_000_000)
      return "3–4 млн";

    if (value < 5_000_000)
      return "4–5 млн";

    return "5+ млн";
  }

  const filtered = useMemo(() => {

    return cars.filter(car => {

      const searchOk =
        car.brand.toLowerCase().includes(search.toLowerCase()) ||
        car.model.toLowerCase().includes(search.toLowerCase());

      const brandOk =
        !brand ||
        car.brand === brand;

      const bodyOk =
        !body ||
        car.body === body;

      const priceOk =
        !price ||
        priceCategory(car.priceFrom) === price;

      return (
        searchOk &&
        brandOk &&
        bodyOk &&
        priceOk
      );

    });

  }, [
    search,
    brand,
    body,
    price,
  ]);

  return (

    <ThemeProvider>

      <Layout>

        <div className="space-y-10">

          <div>

            <h1 className="text-6xl font-extrabold">
              Каталог китайских автомобилей
            </h1>

            <p className="mt-3 text-slate-500">
              Более {cars.length} автомобилей
            </p>

          </div>

          <SearchBar
            value={search}
            onChange={setSearch}
          />

          <Filters
            brands={brands}
            bodies={bodies}
            prices={prices}
            selectedBrand={brand}
            selectedBody={body}
            selectedPrice={price}
            onBrandChange={setBrand}
            onBodyChange={setBody}
            onPriceChange={setPrice}
          />

          <div className="flex justify-between items-center">

            <h2 className="text-2xl font-bold">
              Автомобили
            </h2>

            <div
              className="
              rounded-xl
              bg-slate-100
              dark:bg-slate-800
              px-4
              py-2
              "
            >
              Найдено: {filtered.length}
            </div>

          </div>

          <div
            className="
            grid
            gap-6
            md:grid-cols-2
            xl:grid-cols-3
            "
          >

            {filtered.map(car => (

              <CarCard
                key={car.id}
                car={car}
              />

            ))}

          </div>

        </div>

      </Layout>

    </ThemeProvider>

  );
}