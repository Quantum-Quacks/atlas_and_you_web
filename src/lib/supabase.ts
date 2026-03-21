import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

// Cliente público (para el frontend)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente admin con service role (solo para API routes del servidor)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
