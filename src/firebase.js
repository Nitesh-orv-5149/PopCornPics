// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4RPc-tsHWjKZ2nnq_40OL3jmiIRVOMCg",
  authDomain: "popcornpics-user-db.firebaseapp.com",
  projectId: "popcornpics-user-db",
  storageBucket: "popcornpics-user-db.firebasestorage.app",
  messagingSenderId: "602048060882",
  appId: "1:602048060882:web:74c1c7945a27199f0d3c0b",
  measurementId: "G-98SR8WXVF4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);