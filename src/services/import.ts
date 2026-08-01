import { supabase } from "../lib/supabase";

export async function findOrCreateBrand(name: string): Promise<number> {
  const { data: brand } = await supabase
    .from("brands")
    .select("id")
    .eq("name", name)
    .maybeSingle();

  if (brand) {
    return brand.id;
  }

  const { data: created, error } = await supabase
    .from("brands")
    .insert({
      name,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return created.id;
}

export async function carExists(
  brandId: number,
  model: string
): Promise<boolean> {
  const { data } = await supabase
    .from("cars")
    .select("id")
    .eq("brand_id", brandId)
    .eq("model", model)
    .maybeSingle();

  return !!data;
}

export async function importCar(car: {
  brand: string;
  model: string;
  priceFrom: number;
  priceTo: number;
}) {
  const brandId = await findOrCreateBrand(car.brand);

  const exists = await carExists(brandId, car.model);

  if (exists) {
    return false;
  }

  const { error } = await supabase
    .from("cars")
    .insert({
      brand_id: brandId,
      model: car.model,
      body: "SUV",
      description: "",
      image_url: null,
      is_active: true,
      price_from: car.priceFrom,
      price_to: car.priceTo,
    });

  if (error) {
    throw error;
  }

  return true;
}