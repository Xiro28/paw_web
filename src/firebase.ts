import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';


import {firebaseConfig} from './secrets.ts'; // Ensure you have your Firebase config in secrets.js

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export default firebaseApp;

// Create login and registration functions
export async function login(email: string, password: string) {
    try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
export async function register(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setPersistence(auth, browserLocalPersistence);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
}