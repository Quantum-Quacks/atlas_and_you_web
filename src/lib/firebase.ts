// Firebase client SDK — usado en el frontend (auth del admin)
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
};

export const IS_MOCK =
  !firebaseConfig.projectId ||
  firebaseConfig.projectId === 'placeholder';

const app = IS_MOCK ? null : (
  getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
);

export const auth = IS_MOCK ? null : getAuth(app!);
