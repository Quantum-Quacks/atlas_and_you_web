import { getDb } from './firebase-admin';
import { mockShippingRates } from './mock-data';
import { IS_MOCK } from './firebase-admin';

export interface ShippingRate {
  id: string;
  carrier: string;
  name: string;
  description: string;
  rate: number;
  estimated_days: string;
  free_from_amount: number | null;
}

export async function calculateShipping(
  country: string,
  orderTotal: number,
  weightGrams: number
): Promise<ShippingRate[]> {
  if (IS_MOCK) return mockShippingRates;

  const db = getDb();

  // Buscar zona que incluya el país
  const zonesSnap = await db.collection('shipping_zones').get();
  const zone = zonesSnap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .find((z: any) => z.countries?.includes(country));

  if (!zone) return [];

  // Buscar tarifas de esa zona
  const ratesSnap = await db
    .collection('shipping_rates')
    .where('zone_id', '==', zone.id)
    .get();

  const rates = ratesSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

  return rates
    .filter(rate => {
      const weightOk = (!rate.min_weight_g || weightGrams >= rate.min_weight_g) &&
                       (!rate.max_weight_g || weightGrams <= rate.max_weight_g);
      const priceOk  = (!rate.min_order_price || orderTotal >= rate.min_order_price) &&
                       (!rate.max_order_price || orderTotal <= rate.max_order_price);
      return weightOk && priceOk;
    })
    .map(rate => ({
      id: rate.id,
      carrier: rate.carrier,
      name: rate.name,
      description: rate.description || '',
      rate: rate.free_from_amount && orderTotal >= rate.free_from_amount ? 0 : rate.rate,
      estimated_days: rate.estimated_days || '',
      free_from_amount: rate.free_from_amount || null,
    }));
}
