'use client';

import { ReactNode, useEffect, useState } from 'react';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth, signInAnonymously } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseProvider } from './provider';

// This is a public configuration and is safe to expose.
// Security is handled by Firebase Security Rules.
const firebaseConfig = {
  projectId: "studio-3188130158-ae9bd",
  appId: "1:464010366816:web:bdba82d0abc1edcb975805",
  apiKey: "AIzaSyBClfAUQ-o_v0M55INKzhplgrMtJ3E90cU",
  authDomain: "studio-3188130158-ae9bd.firebaseapp.com",
  messagingSenderId: "464010366816",
};

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({
  children,
}: FirebaseClientProviderProps) {
  const [firebaseApp, setFirebaseApp] = useState<FirebaseApp | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [firestore, setFirestore] = useState<Firestore | null>(null);

  useEffect(() => {
    try {
      const app = initializeApp(firebaseConfig);
      const authInstance = getAuth(app);
      const firestoreInstance = getFirestore(app);

      setFirebaseApp(app);
      setAuth(authInstance);
      setFirestore(firestoreInstance);
      
      // Sign in anonymously to ensure a user session is always available
      signInAnonymously(authInstance).catch(error => {
        console.error("Anonymous sign-in failed:", error);
      });

    } catch (error) {
      console.error("Firebase initialization error:", error);
    }
  }, []);

  return (
    <FirebaseProvider firebaseApp={firebaseApp} auth={auth} firestore={firestore}>
      {children}
    </FirebaseProvider>
  );
}