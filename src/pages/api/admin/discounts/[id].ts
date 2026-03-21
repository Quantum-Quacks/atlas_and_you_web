import type { APIRoute } from 'astro';
import { getDb } from '../../../../lib/firebase-admin';

export const PATCH: APIRoute = async ({ params, request }) => {
  const body = await request.json();
  await getDb().collection('discount_codes').doc(params.id!).update(body);
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
};

export const DELETE: APIRoute = async ({ params }) => {
  await getDb().collection('discount_codes').doc(params.id!).delete();
  return new Response(null, { status: 204 });
};
