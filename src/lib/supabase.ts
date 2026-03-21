import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

export const IS_MOCK = !supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co';

// Cliente público (para el frontend)
export const supabase = IS_MOCK
  ? null as any
  : createClient(supabaseUrl, supabaseAnonKey);

// Cliente admin con service role (solo para API routes del servidor)
export const supabaseAdmin = IS_MOCK
  ? null as any
  : createClient(supabaseUrl, supabaseServiceKey);
