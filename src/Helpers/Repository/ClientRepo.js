import { query, getDocs, setDoc, doc, collection, getDoc, where } from "firebase/firestore";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { currentDateTimestamp } from '../Utils/Common'
import { updateCurrentUser } from "firebase/auth";
import { firestore, auth, storage } from '../Utils/Firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const getStores = async () => {
    try {
        // const storesQuery = query(collection(firestore, 'store'), where('lguId', '==', userDetails.id));
        const storesQuery = query(collection(firestore, 'store'));

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
        const docRef = doc(collection(firestore, 'user'), clientId);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
            await setDoc(docRef, update, { merge: true });
            return true;
        } else {
            throw new Error('Client not found');
        }
    } catch (error) {
        throw error;
    }
};

export const updateUserPhoto = async (imageUrl, id) => {
    try {
        const storageRef = ref(storage, `lgu/${id}_photo`);
        const profilePhotoSnapshot = await uploadBytes(storageRef, imageUrl, 'data_url');
        const downloadURL = await getDownloadURL(profilePhotoSnapshot.ref);

        const docRef = doc(collection(firestore, 'user'), id);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
            await setDoc(docRef, { photo: downloadURL }, { merge: true });
            return true;
        } else {
            throw new Error('Client not found');
        }
    }
    catch (error) {
        throw error
    }
}

export const updateUserProfile = async (data, id) => {
    try {
        const docRef = doc(collection(firestore, 'user'), id);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
            await setDoc(docRef, data, { merge: true });
            return true;
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        throw error
    }
}


export const deleteClient = async (clientId) => {
    try {
        const docRef = doc(collection(firestore, 'user'), clientId);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
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
        const docRef = doc(collection(firestore, 'user'), searchId);
        const userDocument = await getDoc(docRef);

        if (userDocument.exists()) {
            return {
                id: userDocument.id,
                ...userDocument.data()
            };
        } else {
            return null;
        }
    }
    catch (error) {
        throw error;
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

        await setDoc(doc(userCollectionRef, uid), {
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