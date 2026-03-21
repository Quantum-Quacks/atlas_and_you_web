import type { APIRoute } from 'astro';
import { getDb } from '../../../../lib/firebase-admin';

export const DELETE: APIRoute = async ({ params }) => {
  await getDb().collection('tax_rates').doc(params.id!).delete();
  return new Response(null, { status: 204 });
};
