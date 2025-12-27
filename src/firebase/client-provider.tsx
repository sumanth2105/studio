
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
      apiKey: "YOUR_API_KEY",
      authDomain: "insure-trust-aiv2-dev.firebaseapp.com",
      projectId: "insure-trust-aiv2-dev",
      storageBucket: "insure-trust-aiv2-dev.appspot.com",
      messagingSenderId: "1234567890",
      appId: "1:1234567890:web:1234567890abcdef"
    };
    
    // Simple check to see if the placeholder values have been replaced.
    // In a real production environment, you would use a more robust system.
    if (firebaseConfig.apiKey === "YOUR_API_KEY") {
        console.error("Firebase config is not set. Please replace placeholder values in src/firebase/client-provider.tsx");
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
