import { supabase } from "../lib/supabase";

export async function getRegions() {
  const { data, error } = await supabase
    .from("region_coverage")
    .select("city")
    .order("city");

  if (error) {
    throw error;
  }

  const cities = [...new Set(
    (data ?? [])
      .map((item) => item.city)
      .filter(Boolean)
  )];

  return cities;
}

export async function getBrandsByRegion(city: string) {
  const { data, error } = await supabase
    .from("region_coverage")
    .select("brand")
    .eq("city", city)
    .order("brand");

  if (error) {
    throw error;
  }

  return [...new Set(
    (data ?? [])
      .map((item) => item.brand)
      .filter(Boolean)
  )];
}
