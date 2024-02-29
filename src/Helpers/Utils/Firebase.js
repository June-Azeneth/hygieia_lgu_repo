import { initializeApp } from 'firebase/app';
import { getFirestore, query, getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyARkbDyJ8-fTwTSBmFhzvQecRDe4bVxPaY",
    authDomain: "hygieiadb-44a6b.firebaseapp.com",
    projectId: "hygieiadb-44a6b",
    storageBucket: "hygieiadb-44a6b.appspot.com",
    messagingSenderId: "824643133220",
    appId: "1:824643133220:web:e1f09dca55032a63099db1",
    measurementId: "G-Z4ZXQE12XL"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export {firestore, auth};