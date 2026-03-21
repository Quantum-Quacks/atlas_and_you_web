import type { APIRoute } from 'astro';
import { stripe } from '../../../lib/stripe';
import { supabaseAdmin } from '../../../lib/supabase';
import { sendOrderConfirmation, sendAdminNewOrder, sendLowStockAlert } from '../../../lib/email';

export const POST: APIRoute = async ({ request }) => {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return new Response('Missing signature', { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      import.meta.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error('Webhook signature error:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const orderId = session.metadata?.order_id;

    if (!orderId) return new Response('OK', { status: 200 });

    // Actualizar estado del pedido
    const { data: order } = await supabaseAdmin
      .from('orders')
      .update({
        status: 'paid',
        payment_status: 'paid',
        stripe_payment_intent: session.payment_intent,
      })
      .eq('id', orderId)
      .select('*, order_items(*)')
      .single();

    if (!order) return new Response('Order not found', { status: 404 });

    // Descontar stock de cada producto
    for (const item of order.order_items) {
      const { data: product } = await supabaseAdmin
        .from('products')
        .select('id, name, stock')
        .eq('id', item.product_id)
        .single();

      if (product) {
        const newStock = Math.max(0, product.stock - item.quantity);
        await supabaseAdmin
          .from('products')
          .update({ stock: newStock })
          .eq('id', product.id);

        // Registrar movimiento de stock
        await supabaseAdmin.from('stock_movements').insert({
          product_id: product.id,
          quantity_change: -item.quantity,
          reason: 'sale',
          order_id: orderId,
        });

        // Alertar si stock bajo
        if (newStock <= 3) {
          await sendLowStockAlert({ name: product.name, stock: newStock }).catch(console.error);
        }
      }
    }

    // Actualizar usos de código de descuento
    if (order.discount_code) {
      await supabaseAdmin.rpc('increment_discount_usage', { code: order.discount_code });
    }

    // Enviar emails
    const emailData = {
      ...order,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      items: order.order_items,
    };

    await Promise.allSettled([
      sendOrderConfirmation(emailData),
      sendAdminNewOrder(emailData),
    ]);
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as any;
    const orderId = session.metadata?.order_id;
    if (orderId) {
      await supabaseAdmin
        .from('orders')
        .update({ status: 'cancelled', payment_status: 'failed' })
        .eq('id', orderId);
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
