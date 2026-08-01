import { supabase } from "../lib/supabase";

export async function getDealersForCar(carId: number) {
  // Получаем id дилеров
  const { data: links, error: linkError } = await supabase
    .from("car_dealers")
    .select("dealer_id")
    .eq("car_id", carId);

  if (linkError) throw linkError;

  if (!links || links.length === 0) {
    return [];
  }

  const ids = links.map((x) => x.dealer_id);

  // Получаем самих дилеров
  const { data: dealers, error: dealerError } = await supabase
    .from("dealers")
    .select("*")
    .in("id", ids)
    .order("name");

  if (dealerError) throw dealerError;

  return dealers ?? [];
}