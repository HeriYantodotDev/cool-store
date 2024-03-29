import {
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  NextOrObserver,
  User,
} from 'firebase/auth';

import { userSnapshotExists } from './db/users.db';

import { firebaseApp } from './firebase.config';

import {
  ErrorEmailInUse,
  ErrorInvalidCredential,
} from '../utils/Errors/ErrorClass';

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const auth = getAuth(firebaseApp);

export async function signInWithGooglePopOut() {
  const userCredential = await signInWithPopup(auth, googleProvider);
  const userExists = await userSnapshotExists(userCredential.user);
  if (!userExists) {
    throw new ErrorInvalidCredential();
  }

  return userCredential;
}

export async function signUpWithGooglePopOut() {
  const userCredential = await signInWithPopup(auth, googleProvider);
  const userExists = await userSnapshotExists(userCredential.user);
  if (userExists) {
    throw new ErrorEmailInUse();
  }
  return userCredential;
}

export function signInWithGoogleRedirect() {
  return signInWithRedirect(auth, googleProvider);
}

export async function createAuthUserWithEmailAndPassword(
  email: string,
  password: string
) {
  if (!email || !password) return null;

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredential;
}

export async function signInAuthUserWithEmailAndPassword(
  email: string,
  password: string
) {
  if (!email || !password) return null;

  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredential;
}

export async function signOutUser() {
  await signOut(auth);
  window.location.reload();
}

export function onAuthStateChangedListener(callback: NextOrObserver<User>) {
  return onAuthStateChanged(auth, callback);
}
