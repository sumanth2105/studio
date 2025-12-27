
'use client';

import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { Firestore, getFirestore }from 'firebase/firestore';
import { ReactNode, useEffect } from 'react';

import { FirebaseProvider } from './provider';

let firebaseApp: FirebaseApp | null = null;
let firestore: Firestore | null = null;
let auth: Auth | null = null;

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  if (!firebaseApp) {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
    
    // Simple check to see if the placeholder values have been replaced.
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'YOUR_API_KEY') {
        console.error("Firebase config is not set. Please check your environment variables.");
        // We can render children without Firebase to avoid a hard crash,
        // though Firebase features will not work.
        return <>{children}</>;
    }
    
    firebaseApp = initializeApp(firebaseConfig);
    firestore = getFirestore(firebaseApp);
    auth = getAuth(firebaseApp);
  }

  useEffect(() => {
    if (auth && !auth.currentUser) {
      signInAnonymously(auth).catch((error) => {
        console.error("Anonymous sign-in failed on startup:", error);
      });
    }
  }, []);

  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      firestore={firestore}
      auth={auth}
    >
      {children}
    </FirebaseProvider>
  );
}
