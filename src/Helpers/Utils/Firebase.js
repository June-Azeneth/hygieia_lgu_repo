// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

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
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = getAuth(app);
// export { db, auth };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };