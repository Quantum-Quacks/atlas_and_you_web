import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabase';

export const GET: APIRoute = async ({ url }) => {
  const code = url.searchParams.get('code')?.toUpperCase();

  if (!code) {
    return new Response(JSON.stringify({ valid: false }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const now = new Date().toISOString();
  const { data: discount } = await supabaseAdmin
    .from('discount_codes')
    .select('*')
    .eq('code', code)
    .eq('active', true)
    .or(`valid_until.is.null,valid_until.gte.${now}`)
    .or(`valid_from.is.null,valid_from.lte.${now}`)
    .single();

  if (!discount) {
    return new Response(JSON.stringify({ valid: false }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (discount.max_uses && discount.used_count >= discount.max_uses) {
    return new Response(JSON.stringify({ valid: false }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let description = '';
  if (discount.type === 'percentage') description = `${discount.value}% de descuento`;
  else if (discount.type === 'fixed') description = `${discount.value}€ de descuento`;
  else if (discount.type === 'free_shipping') description = 'Envío gratis';

  return new Response(JSON.stringify({
    valid: true,
    code: discount.code,
    type: discount.type,
    value: discount.value,
    description,
    min_order_amount: discount.min_order_amount,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
