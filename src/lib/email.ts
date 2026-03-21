import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);
const ADMIN_EMAIL = import.meta.env.ADMIN_EMAIL;
const FROM_EMAIL = 'Atlas&You <noreply@atlasandyou.es>';

export async function sendOrderConfirmation(order: any) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: order.customer_email,
    subject: `Confirmación de pedido #${order.order_number} — Atlas&You`,
    html: orderConfirmationHtml(order),
  });
}

export async function sendAdminNewOrder(order: any) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `Nuevo pedido #${order.order_number} — ${order.total}€`,
    html: adminNewOrderHtml(order),
  });
}

export async function sendShippingNotification(order: any) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: order.customer_email,
    subject: `Tu pedido #${order.order_number} ha sido enviado`,
    html: shippingNotificationHtml(order),
  });
}

export async function sendLowStockAlert(product: any) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `⚠️ Stock bajo: ${product.name} (${product.stock} unidades)`,
    html: `<p>El producto <strong>${product.name}</strong> tiene stock bajo: <strong>${product.stock} unidades</strong>.</p>`,
  });
}

function orderConfirmationHtml(order: any) {
  const itemsHtml = order.items.map((item: any) => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${item.name}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${item.unit_price.toFixed(2)}€</td>
    </tr>
  `).join('');

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333">
      <div style="background:#1a1a2e;padding:30px;text-align:center">
        <h1 style="color:#e8c9a0;margin:0;font-size:24px">Atlas&You</h1>
        <p style="color:#a0a0c0;margin:5px 0 0">Joyería Artesanal</p>
      </div>
      <div style="padding:30px">
        <h2>¡Gracias por tu pedido!</h2>
        <p>Hola ${order.customer_name}, hemos recibido tu pedido correctamente.</p>
        <p><strong>Pedido #${order.order_number}</strong></p>

        <table style="width:100%;border-collapse:collapse;margin:20px 0">
          <thead>
            <tr style="background:#f5f5f5">
              <th style="padding:8px;text-align:left">Producto</th>
              <th style="padding:8px;text-align:center">Cant.</th>
              <th style="padding:8px;text-align:right">Precio</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <div style="text-align:right;margin-top:10px">
          <p>Subtotal: ${order.subtotal.toFixed(2)}€</p>
          ${order.discount_amount > 0 ? `<p>Descuento: -${order.discount_amount.toFixed(2)}€</p>` : ''}
          <p>Envío: ${order.shipping_cost.toFixed(2)}€</p>
          <p>IVA (21%): ${order.tax_amount.toFixed(2)}€</p>
          <p style="font-size:18px;font-weight:bold">Total: ${order.total.toFixed(2)}€</p>
        </div>

        <hr style="margin:20px 0">
        <h3>Dirección de envío</h3>
        <p>
          ${order.shipping_address.name}<br>
          ${order.shipping_address.street}<br>
          ${order.shipping_address.postal_code} ${order.shipping_address.city}<br>
          ${order.shipping_address.country}
        </p>
      </div>
      <div style="background:#f5f5f5;padding:20px;text-align:center;font-size:12px;color:#999">
        <p>Atlas&You — Joyería artesanal hecha con amor</p>
      </div>
    </div>
  `;
}

function adminNewOrderHtml(order: any) {
  return `
    <h2>Nuevo pedido recibido</h2>
    <p><strong>Pedido:</strong> #${order.order_number}</p>
    <p><strong>Cliente:</strong> ${order.customer_name} (${order.customer_email})</p>
    <p><strong>Total:</strong> ${order.total.toFixed(2)}€</p>
    <p><strong>Envío a:</strong> ${order.shipping_address.city}, ${order.shipping_address.country}</p>
    <p><a href="${import.meta.env.PUBLIC_SITE_URL}/admin/pedidos/${order.id}">Ver pedido en el panel</a></p>
  `;
}

function shippingNotificationHtml(order: any) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333">
      <div style="background:#1a1a2e;padding:30px;text-align:center">
        <h1 style="color:#e8c9a0;margin:0;font-size:24px">Atlas&You</h1>
      </div>
      <div style="padding:30px">
        <h2>¡Tu pedido está en camino!</h2>
        <p>Hola ${order.customer_name}, tu pedido #${order.order_number} ha sido enviado.</p>
        ${order.tracking_number ? `
          <div style="background:#f5f5f5;padding:15px;border-radius:8px;margin:20px 0">
            <p style="margin:0"><strong>Transportista:</strong> ${order.shipping_carrier}</p>
            <p style="margin:5px 0 0"><strong>Número de seguimiento:</strong> ${order.tracking_number}</p>
            ${order.tracking_url ? `<p style="margin:5px 0 0"><a href="${order.tracking_url}">Seguir mi envío</a></p>` : ''}
          </div>
        ` : ''}
        <p>Recibirás tu pedido en los próximos días. ¡Gracias por confiar en Atlas&You!</p>
      </div>
    </div>
  `;
}
