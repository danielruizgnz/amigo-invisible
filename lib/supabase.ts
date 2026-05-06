import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Cliente público (browser / server components sin privilegios elevados)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente con service role para server actions (bypasa RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
