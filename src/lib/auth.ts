import { supabase } from './supabase';

export async function getSession(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const accessToken = parseCookie(cookie, 'sb-access-token');
  const refreshToken = parseCookie(cookie, 'sb-refresh-token');

  if (!accessToken) return null;

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) return null;

  return user;
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
