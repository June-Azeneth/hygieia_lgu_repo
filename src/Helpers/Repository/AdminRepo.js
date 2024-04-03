import { query, getDocs, setDoc, doc, collection, where } from "firebase/firestore";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { updateCurrentUser } from "firebase/auth";
import { firestore, auth } from '../Utils/Firebase'

export const getAllAdmins = async () => {
    try {
        const adminQuery = query(collection(firestore, 'user'), where('status', '==', "active"), where('type', '==', 'admin'));

        const querySnapshot = await getDocs(adminQuery);

        const admins = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return admins;
    } catch (error) {
        return [];
    }
}

export const getAdminById = async (id) => {
    try {
        const ref = collection(firestore, 'user');
        const userQuery = query(ref, where('id', '==', id),);

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

export const addAdmin = async (email, password, data) => {
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
            id: uid
        });

        await updateCurrentUser(auth, originalUser);
        return true;
    } catch (error) {
        await updateCurrentUser(auth, originalUser);
        throw error
    }
}

export const deleteAdmin = async (id) => {
    try {
        const querySnapshot = await getDocs(query(collection(firestore, 'user'), where('id', '==', id)));
        if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            await setDoc(docRef, { status: "deleted" }, { merge: true });
            return true;
        } else {
            throw new Error('Client not found');
        }
    }
    catch (error) {
        throw error
    }
}

export const editAdmin = async (id, update) => {
    try {
        const querySnapshot = await getDocs(query(collection(firestore, 'user'), where('id', '==', id)));
        if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            await setDoc(docRef, update, { merge: true });
            return true
        } else {
            throw new Error('Client not found');
        }
    }
    catch (error) {
        throw error
    }
}