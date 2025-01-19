import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDp9I-Wir_4rrIOhqTsJNyMlb0pqxZUj2c",
  authDomain: "aussie-wheels.firebaseapp.com",
  projectId: "aussie-wheels",
  storageBucket: "aussie-wheels.firebasestorage.app",
  messagingSenderId: "221216924023",
  appId: "1:221216924023:web:26f14cdea7284fd7804172",
  measurementId: "G-VC7QP3CW3G"
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Only initialize analytics on the client side
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, auth, db, storage, analytics }; 