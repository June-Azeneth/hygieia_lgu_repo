import { query, getDocs, setDoc, collection, doc, updateDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { firestore, auth } from '../Utils/Firebase'
import { currentDateTimestamp } from '../Utils/Common'

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
        createUserWithEmailAndPassword(auth, credentials.email, credentials.password)
            .then((userCredential) => {
                const user = userCredential.user;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
        await setDoc(documentRef, { dateJoined: currentDateTimestamp }, { merge: true });
    } catch {

    }
}

export const updateStoreStatus = async (documentId, newValue) => {
    try {
        const documentRef = doc(firestore, 'store', documentId);

        await updateDoc(documentRef, {
            status: newValue
        });
    } catch (error) {
    }
};

export const setReasonForRejection = async (documentId, reason) => {
    try {
        const documentRef = doc(firestore, 'store', documentId);
        await setDoc(documentRef, { reason: reason }, { merge: true });
    }
    catch {

    }
}