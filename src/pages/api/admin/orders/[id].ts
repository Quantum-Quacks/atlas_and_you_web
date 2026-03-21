import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../../lib/supabase';
import { sendShippingNotification } from '../../../../lib/email';

export const PATCH: APIRoute = async ({ params, request }) => {
  const { id } = params;
  const body = await request.json();
  const { send_shipping_email, ...updateData } = body;

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error || !order) {
    return new Response(JSON.stringify({ error: 'Error al actualizar' }), { status: 500 });
  }

  // Enviar email de envío si se solicita
  if (send_shipping_email && updateData.status === 'shipped') {
    await sendShippingNotification(order).catch(console.error);
  }

  return new Response(JSON.stringify(order), {
    headers: { 'Content-Type': 'application/json' },
  });
};
