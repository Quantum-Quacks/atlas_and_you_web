import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/firebase-admin';

export const POST: APIRoute = async ({ request }) => {
  const settings = await request.json();
  const db = getDb();
  const batch = db.batch();
  Object.entries(settings).forEach(([key, value]) => {
    const ref = db.collection('settings').doc(key);
    batch.set(ref, { value: String(value), updated_at: new Date() }, { merge: true });
  });
  await batch.commit();
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
};
