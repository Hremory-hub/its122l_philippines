// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// Replace these values with your actual Firebase project credentials
// You can find these in your Firebase Console -> Project Settings
const firebaseConfig = {
  apiKey: "AIzaSyCOfV-HqrKezlOpyXOHbqrmras5xR2bYFY",
  authDomain: "dfarm-its122l-philippines.firebaseapp.com",
  projectId: "dfarm-its122l-philippines",
  storageBucket: "dfarm-its122l-philippines.firebasestorage.app",
  messagingSenderId: "447633086709",
  appId: "1:447633086709:web:ab63ebcaab0ee205840dbc",
  measurementId: "G-2RN1HTZKN3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
