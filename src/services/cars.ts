import { supabase } from "../lib/supabase";

export interface CarFormData {
  brand: string;
  model: string;
  body: string;
  priceFrom: number;
  priceTo: number;
  description: string;
}

export async function getCars() {
  const { data, error } = await supabase
    .from("cars")
    .select(`
      *,
      brands (
        id,
        name
      )
    `)
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function createCar(car: CarFormData) {
  // Ищем бренд
  const { data: brandData, error: brandError } = await supabase
    .from("brands")
    .select("id")
    .eq("name", car.brand)
    .maybeSingle();

  if (brandError) {
    throw brandError;
  }

  let brandId: number;

  // Если бренда нет — создаем
  if (!brandData) {
    const { data: newBrand, error } = await supabase
      .from("brands")
      .insert({
        name: car.brand,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    brandId = newBrand.id;
  } else {
    brandId = brandData.id;
  }

  // Проверяем, есть ли уже такой автомобиль
  const { data: exists, error: existsError } = await supabase
    .from("cars")
    .select("id")
    .eq("brand_id", brandId)
    .eq("model", car.model)
    .maybeSingle();

  if (existsError) {
    throw existsError;
  }

  if (exists) {
    console.log(`Автомобиль ${car.brand} ${car.model} уже существует`);
    return;
  }

  // Добавляем автомобиль
  const { error } = await supabase
    .from("cars")
    .insert({
      brand_id: brandId,
      model: car.model,
      body: car.body,
      price_from: car.priceFrom,
      price_to: car.priceTo,
      description: car.description,
      is_active: true,
    });

  if (error) {
    throw error;
  }

  console.log(`Добавлен ${car.brand} ${car.model}`);
}
export async function updateCar(
  id: number,
  car: CarFormData
) {
  const { data: brandData, error: brandError } = await supabase
    .from("brands")
    .select("id")
    .eq("name", car.brand)
    .maybeSingle();

  if (brandError) throw brandError;

  let brandId: number;

  if (!brandData) {
    const { data: newBrand, error } = await supabase
      .from("brands")
      .insert({
        name: car.brand,
      })
      .select()
      .single();

    if (error) throw error;

    brandId = newBrand.id;
  } else {
    brandId = brandData.id;
  }

  const { error } = await supabase
    .from("cars")
    .update({
      brand_id: brandId,
      model: car.model,
      body: car.body,
      price_from: car.priceFrom,
      price_to: car.priceTo,
      description: car.description,
    })
    .eq("id", id);

  if (error) throw error;
}
export async function deleteCar(id: number) {
  const { error } = await supabase
    .from("cars")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}