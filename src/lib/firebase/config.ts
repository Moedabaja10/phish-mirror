import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA4c3pVuhY7vIh99GY8xyRJ8O5-CJ75DeE",
  authDomain: "phisingmirror.firebaseapp.com",
  projectId: "phisingmirror",
  storageBucket: "phisingmirror.firebasestorage.app",
  messagingSenderId: "657720340985",
  appId: "1:657720340985:web:698b8c774dc32e06074d28"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;




