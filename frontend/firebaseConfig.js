import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDC9SEGMWSUZXHgccRWZ7JozDxKXxmA5ys",
  authDomain: "complaints-website.firebaseapp.com",
  projectId: "complaints-website",
  storageBucket: "complaints-website.appspot.com",
  messagingSenderId: "908948376386",
  appId: "1:908948376386:web:399a036c22e6008a6b16db",
  measurementId: "G-6MK5BZ10KC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app)
// window.auth = auth;
export {auth,db};
