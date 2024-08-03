// Import the functions needed from the SDKs
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJb0uOzzrbbnSQH9s2bVAoOIw2yTb4XGg",
  authDomain: "bookapp-1214419.firebaseapp.com",
  projectId: "bookapp-1214419",
  storageBucket: "bookapp-1214419.appspot.com",
  messagingSenderId: "378688318076",
  appId: "1:378688318076:web:c7d95f68197412b525b7f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(app);

export { firestore };
