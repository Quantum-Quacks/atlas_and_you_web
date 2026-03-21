import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { data, error } = await supabaseAdmin.from('shipping_rates').insert(body).select().single();
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify(data), { status: 201, headers: { 'Content-Type': 'application/json' } });
};
