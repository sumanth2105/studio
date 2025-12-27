
import { doc, setDoc, Firestore } from 'firebase/firestore';

/**
 * Sets or updates a user's profile data in Firestore.
 * @param firestore The Firestore instance.
 * @param userId The ID of the user.
 * @param data The user profile data to save.
 */
export function setUserProfile(firestore: Firestore, userId: string, data: any) {
  const userDocRef = doc(firestore, 'users', userId);
  // We use setDoc with merge: true to create the document if it doesn't exist
  // or update it if it does.
  return setDoc(userDocRef, data, { merge: true });
}

    