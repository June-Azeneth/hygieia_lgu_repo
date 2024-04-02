import { query, getDocs, setDoc, doc, collection, where } from "firebase/firestore";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { currentDateTimestamp } from '../Utils/Common'
import { updateCurrentUser } from "firebase/auth";
import { firestore, auth } from '../Utils/Firebase'

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
        const userQuery = query(collection(firestore, 'user'), where('type', '==', 'client'), where('status', '==', 'active'));
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

export const updateClient = async (clientId, update) => {
    try {
        const querySnapshot = await getDocs(query(collection(firestore, 'user'), where('id', '==', clientId)));
        if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            await setDoc(docRef, update, { merge: true });
            return true
        } else {
            throw new Error('Client not found');
        }
    } catch (error) {
        throw error;
    }
}

export const deleteClient = async (clientId) => {
    try {
        const querySnapshot = await getDocs(query(collection(firestore, 'user'), where('id', '==', clientId)));
        if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            await setDoc(docRef, { status: "deleted" }, { merge: true });
            return true;
        } else {
            throw new Error('Client not found');
        }
    } catch (error) {
        throw error;
    }
};

export const getClientById = async (searchId) => {
    try {
        const ref = collection(firestore, 'user');
        const userQuery = query(ref, where('id', '==', searchId),);

        const userDocument = await getDocs(userQuery);

        if (!userDocument.empty) {
            const doc = userDocument.docs[0];
            return {
                id: doc.id,
                ...doc.data()
            };
        } else {
            return null;
        }
    }
    catch (error) {
        throw error
    }
}



export const addClient = async (email, password, data) => {
    const originalUser = auth.currentUser;
    try {
        if (password.length < 6) {
            throw new Error("Password should be at least 6 characters");
        }

        const userCollectionRef = collection(firestore, 'user');

        const credentials = {
            email: email,
            password: password
        }

        const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
        const user = userCredential.user;
        const uid = user.uid;

        const newClient = await setDoc(doc(userCollectionRef, uid), {
            ...data,
            id: uid,
            email: email,
            dateAdded: currentDateTimestamp,
            status: "active",
            type: "client",
        });

        await updateCurrentUser(auth, originalUser);
        return true;
    } catch (error) {
        await updateCurrentUser(auth, originalUser);
        throw error.message
    }
}


//temp
export const addConsumer = async (email, password) => {
    const originalUser = auth.currentUser;
    try {
        if (password.length < 6) {
            throw new Error("Password should be at least 6 characters");
        }

        const credentials = {
            email: email,
            password: password
        }

        const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
        const user = userCredential.user;
        const uid = user.uid;

        await updateCurrentUser(auth, originalUser);
        return uid
    } catch (error) {
        await updateCurrentUser(auth, originalUser);
        throw error.message
    }
}