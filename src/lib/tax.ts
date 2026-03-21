import { supabaseAdmin } from './supabase';

// IVA estándar España
const DEFAULT_TAX_RATE = 0.21;

export async function getTaxRate(country: string): Promise<number> {
  const { data } = await supabaseAdmin
    .from('tax_rates')
    .select('rate_percentage')
    .eq('country', country)
    .single();

  if (data) return data.rate_percentage / 100;

  // Si no hay tasa específica, aplicar España por defecto
  return DEFAULT_TAX_RATE;
}

export function calculateTax(subtotal: number, taxRate: number): number {
  return Math.round(subtotal * taxRate * 100) / 100;
}

export function calculatePriceWithoutTax(priceWithTax: number, taxRate: number): number {
  return Math.round((priceWithTax / (1 + taxRate)) * 100) / 100;
}
