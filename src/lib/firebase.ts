// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Import getAuth
import { getFirestore } from "firebase/firestore"; // Import getFirestore

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
const auth = getAuth(app); // Get Auth instance
const db = getFirestore(app); // Get Firestore instance

export { auth, db, analytics }; // Export the services so they can be used in other components