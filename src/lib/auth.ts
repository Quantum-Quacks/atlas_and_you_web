import { getAdminAuth, IS_MOCK } from './firebase-admin';

export async function getSession(request: Request) {
  if (IS_MOCK) return { uid: 'mock-admin', email: 'admin@atlasandyou.es' };

  const cookie = request.headers.get('cookie') || '';
  const sessionCookie = parseCookie(cookie, 'fb_session');
  if (!sessionCookie) return null;

  try {
    const adminAuth = getAdminAuth();
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decoded;
  } catch {
    return null;
  }
}

export async function requireAdmin(request: Request) {
  const user = await getSession(request);
  if (!user) {
    return new Response(null, {
      status: 302,
      headers: { Location: '/admin/login' },
    });
  }
  return user;
}

function parseCookie(cookieStr: string, name: string): string | null {
  const match = cookieStr.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}
