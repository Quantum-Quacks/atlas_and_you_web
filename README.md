# Atlas&You — Tienda Online

Tienda online para Atlas&You, joyería artesanal hecha con arcilla polimérica y resina.

## Stack

- **Framework:** Astro 4 (SSR con Node adapter)
- **Base de datos:** Supabase (PostgreSQL)
- **Pagos:** Stripe (tarjeta, Apple Pay, Google Pay)
- **Emails:** Resend
- **Imágenes:** Cloudinary
- **Hosting:** Vercel (gratuito)

## Funcionalidades

### Tienda pública
- Homepage con productos destacados y categorías
- Catálogo con filtros por categoría y búsqueda
- Ficha de producto con galería, stock e info
- Carrito de compra persistente
- Checkout con cálculo de envío e IVA en tiempo real
- Códigos de descuento
- Pago seguro con Stripe
- Email de confirmación automático

### Panel de Administración (`/admin`)
- Dashboard con estadísticas (ventas, pedidos, stock bajo)
- CRUD completo de productos con imágenes y stock
- Gestión de pedidos con cambio de estado y tracking
- Email de envío automático al cliente
- Módulo de zonas y tarifas de envío
- Gestión de IVA por país
- Códigos de descuento (%, importe fijo, envío gratis)
- Listado de clientes con historial
- Configuración general de la tienda

## Setup

### 1. Instalar dependencias

```bash
npm install
```

### 2. Variables de entorno

```bash
cp .env.example .env
```

| Variable | Dónde obtenerla |
|---|---|
| `PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys |
| `PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe CLI o Dashboard → Webhooks |
| `CLOUDINARY_CLOUD_NAME` | Dashboard Cloudinary |
| `CLOUDINARY_API_KEY` | Dashboard Cloudinary |
| `CLOUDINARY_API_SECRET` | Dashboard Cloudinary |
| `RESEND_API_KEY` | Dashboard Resend |
| `ADMIN_EMAIL` | Email del administrador |
| `PUBLIC_SITE_URL` | URL pública (ej: https://atlasandyou.es) |

### 3. Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. SQL Editor → ejecutar `supabase/schema.sql`
3. Opcionalmente ejecutar `supabase/seeds.sql` para datos de prueba
4. Authentication → Users → crear usuario admin

### 4. Webhook Stripe (desarrollo)

```bash
stripe listen --forward-to localhost:4321/api/stripe/webhook
```

En producción, añade en Stripe Dashboard:
- URL: `https://tu-dominio.com/api/stripe/webhook`
- Eventos: `checkout.session.completed`, `checkout.session.expired`

### 5. Arrancar en desarrollo

```bash
npm run dev
```

- Tienda: http://localhost:4321
- Admin: http://localhost:4321/admin

### 6. Deploy

```bash
vercel
```

O conecta este repo en [vercel.com](https://vercel.com) para deploys automáticos al hacer push.

## Estructura del proyecto

```
src/
├── pages/
│   ├── index.astro              # Homepage
│   ├── tienda/                  # Catálogo + ficha producto
│   ├── carrito.astro            # Carrito
│   ├── checkout/                # Checkout + confirmación
│   ├── admin/                   # Panel administración completo
│   └── api/                     # Endpoints API
├── components/
│   ├── storefront/              # Componentes tienda
│   └── admin/                   # Componentes admin
├── layouts/
│   ├── StoreLayout.astro        # Layout tienda (nav + footer)
│   └── AdminLayout.astro        # Layout admin (sidebar)
└── lib/
    ├── supabase.ts              # Cliente BD
    ├── stripe.ts                # Cliente pagos
    ├── email.ts                 # Emails transaccionales
    ├── shipping.ts              # Cálculo envíos
    ├── tax.ts                   # Cálculo IVA
    └── auth.ts                  # Auth admin
supabase/
├── schema.sql                   # Esquema BD completo
└── seeds.sql                    # Datos de ejemplo
```

## Tarjetas de test Stripe

| Número | Resultado |
|---|---|
| `4242 4242 4242 4242` | Pago exitoso |
| `4000 0000 0000 0002` | Pago rechazado |

Fecha: cualquier futura · CVC: cualquier 3 dígitos
