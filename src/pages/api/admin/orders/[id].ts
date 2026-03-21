import type { APIRoute } from 'astro';
import { getDb } from '../../../../lib/firebase-admin';
import { sendShippingNotification } from '../../../../lib/email';
import { FieldValue } from 'firebase-admin/firestore';

export const PATCH: APIRoute = async ({ params, request }) => {
  const { id } = params;
  const body = await request.json();
  const { send_shipping_email, ...updateData } = body;
  const db = getDb();

  await db.collection('orders').doc(id!).update({
    ...updateData,
    updated_at: FieldValue.serverTimestamp(),
  });

  if (send_shipping_email && updateData.status === 'shipped') {
    const orderDoc = await db.collection('orders').doc(id!).get();
    const order = { id: orderDoc.id, ...orderDoc.data() };
    await sendShippingNotification(order).catch(console.error);
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
