import { useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function TestSupabase() {
  useEffect(() => {
    async function test() {
      const { data, error } = await supabase
        .from("brands")
        .select("*");

      console.log("DATA:", data);
      console.log("ERROR:", error);
    }

    test();
  }, []);

  return (
    <div className="p-10">
      Проверка подключения к Supabase...
      <br />
      Открой консоль браузера (F12 → Console).
    </div>
  );
}