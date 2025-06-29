import { 
  getAuth, 
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  AuthError,
  PhoneAuthProvider,
  linkWithCredential,
  updatePhoneNumber
} from 'firebase/auth';
import app from '../../config/firebase';

const auth = getAuth(app);

// Initialize reCAPTCHA verifier
let recaptchaVerifier: RecaptchaVerifier | null = null;

export const initializeRecaptcha = (containerId: string) => {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      'size': 'invisible',
      'callback': () => {
        console.log('reCAPTCHA solved');
      }
    });
  }
  return recaptchaVerifier;
};

export const signUpWithPhone = async (phoneNumber: string, password: string) => {
  try {
    if (!recaptchaVerifier) {
      throw new Error('reCAPTCHA not initialized. Please call initializeRecaptcha first.');
    }
    
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return { confirmationResult, phoneNumber };
  } catch (error) {
    const authError = error as AuthError;
    throw new Error(authError.message);
  }
};

export const signInWithPhone = async (phoneNumber: string, password: string) => {
  try {
    if (!recaptchaVerifier) {
      throw new Error('reCAPTCHA not initialized. Please call initializeRecaptcha first.');
    }
    
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return { confirmationResult, phoneNumber };
  } catch (error) {
    const authError = error as AuthError;
    throw new Error(authError.message);
  }
};

export const verifyPhoneCode = async (confirmationResult: any, code: string) => {
  try {
    const result = await confirmationResult.confirm(code);
    return result.user;
  } catch (error) {
    const authError = error as AuthError;
    throw new Error(authError.message);
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return true;
  } catch (error) {
    const authError = error as AuthError;
    throw new Error(authError.message);
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const getCurrentUser = () => {
  return auth.currentUser;
}; 