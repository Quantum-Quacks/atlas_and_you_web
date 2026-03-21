import type { APIRoute } from 'astro';
import { stripe } from '../../../lib/stripe';
import { supabaseAdmin } from '../../../lib/supabase';
import { z } from 'zod';

const CheckoutSchema = z.object({
  cart: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
    image: z.string().optional(),
  })),
  shippingRateId: z.string(),
  shippingCost: z.number(),
  customer: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
  }),
  shippingAddress: z.object({
    name: z.string(),
    street: z.string(),
    city: z.string(),
    postalCode: z.string(),
    province: z.string().optional(),
    country: z.string(),
  }),
  notes: z.string().optional(),
  discountCode: z.string().nullable().optional(),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const data = CheckoutSchema.parse(body);

    const siteUrl = import.meta.env.PUBLIC_SITE_URL || 'http://localhost:4321';

    // Validar descuento
    let discountAmount = 0;
    let discountData = null;
    if (data.discountCode) {
      const { data: discount } = await supabaseAdmin
        .from('discount_codes')
        .select('*')
        .eq('code', data.discountCode.toUpperCase())
        .eq('active', true)
        .single();

      if (discount) {
        const subtotal = data.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (!discount.min_order_amount || subtotal >= discount.min_order_amount) {
          if (!discount.max_uses || discount.used_count < discount.max_uses) {
            discountData = discount;
            if (discount.type === 'percentage') {
              discountAmount = subtotal * (discount.value / 100);
            } else if (discount.type === 'fixed') {
              discountAmount = Math.min(discount.value, subtotal);
            } else if (discount.type === 'free_shipping') {
              discountAmount = data.shippingCost;
            }
          }
        }
      }
    }

    // Construir line items de Stripe
    const lineItems = data.cart.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Añadir envío como line item si tiene coste
    const shippingCostFinal = discountData?.type === 'free_shipping' ? 0 : data.shippingCost;
    if (shippingCostFinal > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: 'Gastos de envío', images: [] },
          unit_amount: Math.round(shippingCostFinal * 100),
        },
        quantity: 1,
      });
    }

    // Calcular total
    const subtotal = data.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal - discountAmount + shippingCostFinal;
    const taxAmount = total * 0.21 / 1.21;

    // Crear pedido en DB (pendiente de pago)
    const orderNumber = `AY-${Date.now()}`;
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        order_number: orderNumber,
        status: 'pending',
        payment_status: 'pending',
        customer_email: data.customer.email,
        customer_name: `${data.customer.firstName} ${data.customer.lastName}`,
        customer_phone: data.customer.phone || null,
        subtotal,
        discount_amount: discountAmount,
        shipping_cost: shippingCostFinal,
        tax_amount: taxAmount,
        total,
        shipping_address: data.shippingAddress,
        notes: data.notes || null,
        discount_code: data.discountCode || null,
      })
      .select()
      .single();

    if (orderError || !order) {
      throw new Error('Error al crear el pedido');
    }

    // Insertar líneas de pedido
    await supabaseAdmin.from('order_items').insert(
      data.cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        total: item.price * item.quantity,
      }))
    );

    // Crear sesión de Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      customer_email: data.customer.email,
      metadata: {
        order_id: order.id,
        order_number: orderNumber,
        discount_code: data.discountCode || '',
      },
      success_url: `${siteUrl}/checkout/confirmacion?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/carrito`,
      locale: 'es',
      shipping_address_collection: undefined,
      phone_number_collection: { enabled: false },
    });

    // Actualizar pedido con ID de sesión Stripe
    await supabaseAdmin
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id);

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Error interno' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
