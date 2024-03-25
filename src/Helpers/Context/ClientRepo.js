import { query, getDocs, addDoc, collection, where } from "firebase/firestore";
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { firestore, auth } from '../Utils/Firebase'
import { currentDateTimestamp } from '../Utils/Common'
import { updateCurrentUser } from "firebase/auth";

export const getStores = async (userDetails) => {
    try {
        const storesQuery = query(collection(firestore, 'store'), where('lguId', '==', userDetails.id));

        const querySnapshot = await getDocs(storesQuery);

        const stores = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return stores;
    } catch (error) {
        console.error('Error getting stores:', error);
        return [];
    }
}


// FOR ADMIN
export const getClients = async () => {
    try {
        const userQuery = query(collection(firestore, 'user'), where('type', '==', 'client'));
        const querySnapshot = await getDocs(userQuery);

        const clients = querySnapshot.docs.map(doc => ({
            ...doc.data()
        }));
        return clients;
    }
    catch (error) {
        throw error.message
    }
}

export const addClient = async (email, password, data) => {
    try {
        if (password.length < 6) {
            throw new Error("Password should be at least 6 characters");
        }

        const originalUser = auth.currentUser;

        const userCollectionRef = collection(firestore, 'user');

        const credentials = {
            email: email,
            password: password
        }

        const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
        const user = userCredential.user;
        const uid = user.uid;

        const newClient = await addDoc(userCollectionRef, {
            ...data,
            id: uid,
            email: email,
            dateAdded: currentDateTimestamp,
            status: "active",
            type: "client"
        });
        await updateCurrentUser(auth, originalUser);
        return true;
    } catch (error) {
        throw error.message
    }
}