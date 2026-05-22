// Firebase initialization placeholder stub
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || 'MOCK_API_KEY',
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || 'mock-careq.firebaseapp.com',
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || 'mock-careq-id',
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || 'mock-careq.appspot.com',
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || '1:123:web:abc',
};

// Initialize Firebase only if config is provided and it hasn't been initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// Simple mock functions for Firebase Auth when running in mock mode
export const mockFirebaseAuth = {
  signInWithEmail: async (email: string) => {
    // Just a bypass that returns dummy user details
    return {
      user: {
        uid: 'uid-' + email.split('@')[0],
        email: email,
        displayName: 'Dr. Mock User',
        getIdToken: async () => 'mock-jwt-token-12345'
      }
    };
  },
  signOut: async () => {
    return Promise.resolve();
  }
};
