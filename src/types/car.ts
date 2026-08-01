export interface Dealer {
  id: number;
  name: string;
}

export interface Brand {
  id: number;
  name: string;
  logo?: string | null;
}

export interface Car {
  id: number;

  model: string;

  body: string;

  description: string;

  priceFrom: number;

  priceTo: number;

  image: string | null;

  brand: Brand;

  dealers: Dealer[];
}