import type { APIRoute } from 'astro';
import { calculateShipping } from '../../../lib/shipping';

export const GET: APIRoute = async ({ url }) => {
  const country = url.searchParams.get('country') || 'ES';
  const weight = parseFloat(url.searchParams.get('weight') || '0');
  const total = parseFloat(url.searchParams.get('total') || '0');

  try {
    const rates = await calculateShipping(country, total, weight);
    return new Response(JSON.stringify(rates), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify([]), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
