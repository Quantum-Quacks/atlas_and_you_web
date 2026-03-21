import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const db = getDb();
  const ref = await db.collection('discount_codes').add({ ...body, used_count: 0, created_at: FieldValue.serverTimestamp() });
  return new Response(JSON.stringify({ id: ref.id }), { status: 201, headers: { 'Content-Type': 'application/json' } });
};
