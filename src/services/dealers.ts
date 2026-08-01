import { supabase } from "../lib/supabase";

export interface DealerFormData {
  name: string;
  dealerCode: string;
  dealerGroup: string;
}

export async function createDealer(dealer: DealerFormData) {
  const { data: exists, error: existsError } = await supabase
    .from("dealers")
    .select("id")
    .eq("name", dealer.name)
    .maybeSingle();

  if (existsError) throw existsError;

  if (exists) {
    return;
  }

  const { error } = await supabase
    .from("dealers")
    .insert({
      name: dealer.name,
      dealer_code: dealer.dealerCode,
      dealer_group: dealer.dealerGroup,
    });

  if (error) throw error;
}