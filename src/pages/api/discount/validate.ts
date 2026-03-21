import type { APIRoute } from 'astro';
import { getDb, IS_MOCK } from '../../../lib/firebase-admin';

export const GET: APIRoute = async ({ url }) => {
  const code = url.searchParams.get('code')?.toUpperCase();
  if (!code) return new Response(JSON.stringify({ valid: false }), { headers: { 'Content-Type': 'application/json' } });

  if (IS_MOCK) {
    if (code === 'BIENVENIDA10') return new Response(JSON.stringify({ valid: true, code, type: 'percentage', value: 10, description: '10% de descuento' }), { headers: { 'Content-Type': 'application/json' } });
    if (code === 'ENVIOGRATIS') return new Response(JSON.stringify({ valid: true, code, type: 'free_shipping', value: 0, description: 'Envío gratis' }), { headers: { 'Content-Type': 'application/json' } });
    return new Response(JSON.stringify({ valid: false }), { headers: { 'Content-Type': 'application/json' } });
  }

  const db = getDb();
  const now = new Date();
  const snap = await db.collection('discount_codes').where('code', '==', code).where('active', '==', true).limit(1).get();

  if (snap.empty) return new Response(JSON.stringify({ valid: false }), { headers: { 'Content-Type': 'application/json' } });

  const discount = snap.docs[0].data() as any;

  if (discount.valid_until && discount.valid_until.toDate() < now) return new Response(JSON.stringify({ valid: false }), { headers: { 'Content-Type': 'application/json' } });
  if (discount.max_uses && discount.used_count >= discount.max_uses) return new Response(JSON.stringify({ valid: false }), { headers: { 'Content-Type': 'application/json' } });

  let description = '';
  if (discount.type === 'percentage') description = `${discount.value}% de descuento`;
  else if (discount.type === 'fixed') description = `${discount.value}€ de descuento`;
  else if (discount.type === 'free_shipping') description = 'Envío gratis';

  return new Response(JSON.stringify({ valid: true, code, type: discount.type, value: discount.value, description, min_order_amount: discount.min_order_amount }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
