import { query, getDocs, setDoc, collection, doc, updateDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { firestore, auth } from '../../Helpers/Utils/Firebase'
import { currentDateTimestamp } from '../../Helpers/Utils/Common'

export const getStores = async () => {
    try {
        const storeCollection = collection(firestore, 'store_account_requests');
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

export const sendEmail = async (accountData) => {
    try {

    }
    catch {

    }
}

export const registerStore = async (documentId, email) => {
    try {
        const documentRef = doc(firestore, 'store_account_requests', documentId);
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
        const documentRef = doc(firestore, 'store_account_requests', documentId);

        await updateDoc(documentRef, {
            status: newValue
        });
    } catch (error) {
    }
};

export const setReasonForRejection = async (documentId, reason) => {
    try {
        const documentRef = doc(firestore, 'store_account_requests', documentId);
        await setDoc(documentRef, { reason: reason }, { merge: true });
    }
    catch {

    }
}