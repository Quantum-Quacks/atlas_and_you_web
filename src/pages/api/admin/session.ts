import type { APIRoute } from 'astro';
import { getAdminAuth, IS_MOCK } from '../../../lib/firebase-admin';

export const POST: APIRoute = async ({ request }) => {
  if (IS_MOCK) {
    return new Response(JSON.stringify({ ok: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': 'fb_session=mock; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800',
      },
    });
  }

  try {
    const { idToken } = await request.json();
    if (!idToken) return new Response('Missing idToken', { status: 400 });

    const adminAuth = getAdminAuth();

    // Verificar que el token es válido antes de crear la session cookie
    await adminAuth.verifyIdToken(idToken);

    // Crear session cookie (válida 7 días)
    const expiresIn = 60 * 60 * 24 * 7 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    return new Response(JSON.stringify({ ok: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `fb_session=${sessionCookie}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800`,
      },
    });
  } catch (err) {
    console.error('Session creation error:', err);
    return new Response('Unauthorized', { status: 401 });
  }
};

export const DELETE: APIRoute = async () => {
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': 'fb_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0',
    },
  });
};
