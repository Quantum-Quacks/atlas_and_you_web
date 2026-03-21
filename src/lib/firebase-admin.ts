// Firebase Admin SDK — solo para API routes del servidor (nunca en el cliente)
import { getApps, initializeApp, cert, type App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

export const IS_MOCK =
  !import.meta.env.FIREBASE_PROJECT_ID ||
  import.meta.env.FIREBASE_PROJECT_ID === 'placeholder';

let adminApp: App | null = null;

function getAdminApp(): App {
  if (adminApp) return adminApp;
  if (getApps().length) {
    adminApp = getApps()[0];
    return adminApp;
  }
  adminApp = initializeApp({
    credential: cert({
      projectId: import.meta.env.FIREBASE_PROJECT_ID,
      clientEmail: import.meta.env.FIREBASE_CLIENT_EMAIL,
      privateKey: import.meta.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
  return adminApp;
}

export function getDb() {
  if (IS_MOCK) return null as any;
  return getFirestore(getAdminApp());
}

export function getAdminAuth() {
  if (IS_MOCK) return null as any;
  return getAuth(getAdminApp());
}
