import { query, getDocs, setDoc, collection, doc, updateDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { firestore, auth } from '../Utils/Firebase'
import { currentDateTimestamp } from '../Utils/Common'

let uid = ""

export const getStores = async () => {
    try {
        const storeCollection = collection(firestore, 'store');
        const storeQuery = query(storeCollection);

        const querySnapshot = await getDocs(storeQuery);
        const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return data;
    } catch (error) {
        return [];
    }
}

export const registerStore = async (documentId, email) => {
    try {
        const documentRef = doc(firestore, 'store', documentId);
        const credentials = {
            email: email,
            password: '123456'
        }
        const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
        const user = userCredential.user;
        uid = user.uid;

        await setDoc(documentRef, { 
            dateJoined: currentDateTimestamp,
            status: "active",
            storeId: uid
         }, { merge: true });
        
    } catch (error) {
        console.error("Error registering store:", error);
        throw error;
    }
}

export const rejectStoreApplication = async (documentId, reason) => {
    try {
        const documentRef = doc(firestore, 'store', documentId);
        await setDoc(documentRef, { 
            reason: reason,
            dateRejected: currentDateTimestamp,
            status: "rejected"
        }, { merge: true });
    }
    catch (error) {
        console.error("Error setting reason for rejection:", error);
        throw error;
    }
}