// import {db} from '../firebase_file'
import { initializeApp } from 'firebase/app';
import { getFirestore, query, getDocs, collection } from "firebase/firestore";

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
const db = getFirestore(app);

export const getStores = async () => {
    try {
        const storeCollection = collection(db, 'store_account_requests');
        const storeQuery = query(storeCollection);

        const querySnapshot = await getDocs(storeQuery);
         const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return data;
    } catch (error) {
        console.error('Error getting data from Firebase: ', error);
        return [];
    }
}