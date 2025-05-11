import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDtBc4_Cf97UtBFAxxmDvvzDfyKPTW0sgU",
  authDomain: "bhavisyaji1.firebaseapp.com",
  projectId: "bhavisyaji1",
  storageBucket: "bhavisyaji1.appspot.com",
  messagingSenderId: "542737746026",
  appId: "1:542737746026:web:34c515e13e2436aa9da213",
  measurementId: "G-72N1V4D475"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// Use the 'prod' Firestore database
export const db = getFirestore(app, "prod");
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
// Commented out emulator connection for production use
// import { connectAuthEmulator } from 'firebase/auth';
// connectAuthEmulator(auth, "http://localhost:9099"); 