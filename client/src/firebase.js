// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "byblog-19cef.firebaseapp.com",
  projectId: "byblog-19cef",
  storageBucket: "byblog-19cef.firebasestorage.app",
  messagingSenderId: "16478414161",
  appId: "1:16478414161:web:394eebf77d65d0d8b89f70",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

