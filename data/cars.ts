export interface Car {
  id: number;
  brand: string;
  model: string;
  body: string;
  price: number;
}

export const cars: Car[] = [
  {
    id: 1,
    brand: "Haval",
    model: "Jolion",
    body: "SUV",
    price: 2199000,
  },
  {
    id: 2,
    brand: "Geely",
    model: "Monjaro",
    body: "SUV",
    price: 4299000,
  },
  {
    id: 3,
    brand: "Chery",
    model: "Tiggo 7 Pro Max",
    body: "SUV",
    price: 3090000,
  },
  {
    id: 4,
    brand: "Omoda",
    model: "C5",
    body: "Crossover",
    price: 2599000,
  },
];
export function getPriceCategory(price: number) {
  if (price < 2_000_000) return "До 2 млн";
  if (price < 3_000_000) return "2–3 млн";
  if (price < 4_000_000) return "3–4 млн";
  if (price < 5_000_000) return "4–5 млн";

  return "5+ млн";
}