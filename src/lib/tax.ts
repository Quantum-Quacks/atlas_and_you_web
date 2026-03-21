import { getDb, IS_MOCK } from './firebase-admin';

const DEFAULT_TAX_RATE = 0.21;

export async function getTaxRate(country: string): Promise<number> {
  if (IS_MOCK) return DEFAULT_TAX_RATE;

  const db = getDb();
  const snap = await db.collection('tax_rates').where('country', '==', country).limit(1).get();

  if (!snap.empty) {
    return snap.docs[0].data().rate_percentage / 100;
  }
  return DEFAULT_TAX_RATE;
}

export function calculateTax(subtotal: number, taxRate: number): number {
  return Math.round(subtotal * taxRate * 100) / 100;
}
