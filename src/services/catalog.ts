import { supabase } from "../lib/supabase";

export async function loadCatalog() {
  const { data, error } = await supabase
    .from("cars")
   .select(`
  *,
  brands(
    id,
    name
  ),
  car_dealers(
    dealers(
      id,
      name
    )
  )
`);

  if (error) throw error;

  return (data ?? []).map((car) => ({
    id: car.id,

    model: car.model,

    body: car.body,

    description: car.description,

    priceFrom: car.price_from,

    priceTo: car.price_to,

    image: car.image_url,

    brand: {
      id: car.brands?.id,
      name: car.brands?.name,
    },

    dealers:
  car.car_dealers
    ?.map((item: any) => item.dealers)
    .filter(Boolean) ?? [],
  }));
}

export async function getBrands() {
  const { data, error } = await supabase
    .from("brands")
    .select("id, name")
    .order("name");

  if (error) throw error;

  return data ?? [];
}