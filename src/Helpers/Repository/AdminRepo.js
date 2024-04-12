import { query, getDocs, setDoc, doc, collection, getDoc,where } from "firebase/firestore";
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
        const docRef = doc(collection(firestore, 'user'), id);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
            return {
                id: docSnapshot.id,
                ...docSnapshot.data()
            };
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
};

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
        const docRef = doc(collection(firestore, 'user'), id);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
            await setDoc(docRef, { status: "deleted" }, { merge: true });
            return true;
        } else {
            throw new Error('Admin not found');
        }
    } catch (error) {
        throw error;
    }
};

export const editAdmin = async (id, update) => {
    try {
        const docRef = doc(collection(firestore, 'user'), id);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
            await setDoc(docRef, update, { merge: true });
            return true;
        } else {
            throw new Error('Admin not found');
        }
    } catch (error) {
        throw error;
    }
};
