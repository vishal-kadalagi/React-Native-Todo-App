import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyA_wBi1I-MFH0H2epdqXjaApdzg0-MB2kE",
  authDomain: "modulus-seventeen-9513d.firebaseapp.com",
  projectId: "modulus-seventeen-9513d",
  storageBucket: "modulus-seventeen-9513d.firebasestorage.app",
  messagingSenderId: "988783029040",
  appId: "1:988783029040:web:ff707f78d61be76836b6f5"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with React Native Async Storage for persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { app, auth, db };
