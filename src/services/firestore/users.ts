import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { UserProfile } from '../../models/user';
import { deleteUser } from 'firebase/auth';
import { auth } from '../../config/firebase';

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

// Delete a user profile by UID
export const deleteUserProfile = async (uid: string) => {
  const userRef = doc(db, 'users', uid);
  await deleteDoc(userRef);
};

// Delete the currently authenticated user from Firebase Auth
export const deleteAuthUser = async () => {
  if (auth.currentUser) {
    await deleteUser(auth.currentUser);
  } else {
    throw new Error('No authenticated user');
  }
}; 