import { supabase } from "../lib/supabase";

export async function uploadCarImage(
  carId: number,
  file: File
) {
  const extension = file.name.split(".").pop() || "jpg";
  const fileName = `${carId}-${Date.now()}.${extension}`;

  // Загружаем файл в Storage
  const { error: uploadError } = await supabase.storage
    .from("cars")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    console.error("Ошибка загрузки:", uploadError);
    throw uploadError;
  }

  // Получаем публичную ссылку
  const {
    data: { publicUrl },
  } = supabase.storage
    .from("cars")
    .getPublicUrl(fileName);

  console.log("Public URL:", publicUrl);

  // Записываем ссылку в таблицу cars
  const { data, error } = await supabase
    .from("cars")
    .update({
      image_url: publicUrl,
    })
    .eq("id", carId)
    .select();

  console.log("Результат обновления:", data);
  console.log("Ошибка обновления:", error);

  if (error) {
    throw error;
  }

  return publicUrl;
}
