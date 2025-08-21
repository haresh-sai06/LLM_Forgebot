// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3cIUul4sk7uN0xvjMCZ_l4_jVLodEZHQ",
  authDomain: "llmforgebot.firebaseapp.com",
  projectId: "llmforgebot",
  storageBucket: "llmforgebot.firebasestorage.app",
  messagingSenderId: "286106831325",
  appId: "1:286106831325:web:d48b00e3c9a9f132bcce34",
  measurementId: "G-R0RSKFL368"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;