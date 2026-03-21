import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../../../lib/supabase';

export const DELETE: APIRoute = async ({ params }) => {
  await supabaseAdmin.from('shipping_rates').delete().eq('id', params.id);
  return new Response(null, { status: 204 });
};
