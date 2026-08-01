import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://tsdlmgcmfkcdtwumweqi.supabase.co",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_BDLLpQ5krV8PvpRHZYxWyg_xEFIfgrs"
);