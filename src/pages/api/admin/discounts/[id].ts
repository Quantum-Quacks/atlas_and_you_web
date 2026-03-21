import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../../lib/supabase';

export const PATCH: APIRoute = async ({ params, request }) => {
  const body = await request.json();
  const { data, error } = await supabaseAdmin.from('discount_codes').update(body).eq('id', params.id).select().single();
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
};

export const DELETE: APIRoute = async ({ params }) => {
  await supabaseAdmin.from('discount_codes').delete().eq('id', params.id);
  return new Response(null, { status: 204 });
};
