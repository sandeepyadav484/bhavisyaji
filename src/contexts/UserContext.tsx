import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange, getCurrentUser, signInWithEmail, signUpWithEmail, signOut as firebaseSignOut } from '../services/auth';
import { getUserProfile } from '../services/firestore/users';

interface UserProfile {
  uid: string;
  dob?: string;
  tob?: string;
  place?: string;
  [key: string]: any;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        const prof = await getUserProfile(user.uid);
        setProfile(prof);
      } else {
        setProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const user = await signInWithEmail(email, password);
    setUser(user);
    return user;
  };
  const signUp = async (email: string, password: string) => {
    const user = await signUpWithEmail(email, password);
    setUser(user);
    return user;
  };
  const signOut = async () => {
    await firebaseSignOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, setUser, profile, setProfile, signIn, signUp, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 