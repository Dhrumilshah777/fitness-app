// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCESQLDs_tfJ8BCi2T-Ma_s-LqdnWW-Fzw",
  authDomain: "fitness-app-2ba90.firebaseapp.com",
  projectId: "fitness-app-2ba90",
  storageBucket: "fitness-app-2ba90.firebasestorage.app",
  messagingSenderId: "643398597884",
  appId: "1:643398597884:web:50741f35e6b2a53ff1eb79",
  measurementId: "G-X9W9VR3Y9L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();  // ✅ match name
