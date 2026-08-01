import { supabase } from "../lib/supabase";

export async function uploadCarImage(
  carId: number,
  file: File
) {
  const extension = file.name.split(".").pop();

  const fileName = `${carId}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("cars")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("cars")
    .getPublicUrl(fileName);

  const { error } = await supabase
    .from("cars")
    .update({
      image_url: publicUrl,
    })
    .eq("id", carId);

  if (error) throw error;

  return publicUrl;
}