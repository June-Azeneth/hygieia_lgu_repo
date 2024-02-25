// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARkbDyJ8-fTwTSBmFhzvQecRDe4bVxPaY",
  authDomain: "hygieiadb-44a6b.firebaseapp.com",
  projectId: "hygieiadb-44a6b",
  storageBucket: "hygieiadb-44a6b.appspot.com",
  messagingSenderId: "824643133220",
  appId: "1:824643133220:web:e1f09dca55032a63099db1",
  measurementId: "G-Z4ZXQE12XL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const firestore = getFirestore(app)
export const authentication = getAuth(app)
export const signInWithEmailAndPass = signInWithEmailAndPassword(app)