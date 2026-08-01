import { supabase } from "../lib/supabase";

export async function getCarDealers(carId: number) {
  const { data, error } = await supabase
    .from("car_dealers")
    .select("dealer_id")
    .eq("car_id", carId);

  if (error) throw error;

  return (data ?? []).map((item) => item.dealer_id);
}

export async function saveCarDealers(
  carId: number,
  dealerIds: number[]
) {
  const { error: deleteError } = await supabase
    .from("car_dealers")
    .delete()
    .eq("car_id", carId);

  if (deleteError) throw deleteError;

  if (dealerIds.length === 0) return;

  const rows = dealerIds.map((dealerId) => ({
    car_id: carId,
    dealer_id: dealerId,
  }));

  const { error: insertError } = await supabase
    .from("car_dealers")
    .insert(rows);

  if (insertError) throw insertError;
}