import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { UserProfile } from '../../models/user';

// Save a new user profile (or overwrite existing)
export const saveUserProfile = async (profile: UserProfile) => {
  const userRef = doc(db, 'users', profile.uid);
  await setDoc(userRef, profile, { merge: true });
};

// Retrieve a user profile by UID
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
};

// Update an existing user profile (partial update)
export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, data);
}; 