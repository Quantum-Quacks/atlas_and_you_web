import { supabaseAdmin } from './supabase';

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
  // Buscar zona para el país
  const { data: zones } = await supabaseAdmin
    .from('shipping_zones')
    .select('id, name, countries');

  if (!zones) return [];

  const zone = zones.find(z => z.countries.includes(country));
  if (!zone) return [];

  // Buscar tarifas aplicables
  const { data: rates } = await supabaseAdmin
    .from('shipping_rates')
    .select('*')
    .eq('zone_id', zone.id)
    .or(`min_weight_g.lte.${weightGrams},min_weight_g.is.null`)
    .or(`max_weight_g.gte.${weightGrams},max_weight_g.is.null`)
    .or(`min_order_price.lte.${orderTotal},min_order_price.is.null`)
    .or(`max_order_price.gte.${orderTotal},max_order_price.is.null`);

  if (!rates) return [];

  return rates.map(rate => ({
    id: rate.id,
    carrier: rate.carrier,
    name: rate.name,
    description: rate.description,
    rate: rate.free_from_amount && orderTotal >= rate.free_from_amount ? 0 : rate.rate,
    estimated_days: rate.estimated_days,
    free_from_amount: rate.free_from_amount,
  }));
}
