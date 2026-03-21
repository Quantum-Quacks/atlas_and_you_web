import type { APIRoute } from 'astro';
import { getDb } from '../../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const ref = await getDb().collection('shipping_rates').add({ ...body, created_at: FieldValue.serverTimestamp() });
  return new Response(JSON.stringify({ id: ref.id }), { status: 201, headers: { 'Content-Type': 'application/json' } });
};
