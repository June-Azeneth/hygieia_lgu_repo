import { collection, query, getDocs, where, addDoc, setDoc } from 'firebase/firestore';
import { firestore } from '../Utils/Firebase';

export const getAllConsumers = async () => {
    try {
        const userQuery = query(collection(firestore, 'consumer'), where('status', '==', 'active'));
        const querySnapshot = await getDocs(userQuery);

        const clients = querySnapshot.docs.map(doc => ({
            ...doc.data()
        }));
        return clients;
    }
    catch (error) {
        throw error
    }
}

export const getByConsumerID = async (id) => {
    try {
        const ref = collection(firestore, 'consumer');
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

export const deleteConsumerRecord = async (id) => {
    try {
        const querySnapshot = await getDocs(query(collection(firestore, 'consumer'), where('id', '==', id)));
        if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            await setDoc(docRef, { status: "deleted" }, { merge: true });
            return true;
        } else {
            throw new Error('Consumer not found');
        }
    }
    catch (error) {
        throw error
    }
}

export const updateConsumer = async (id, data) => {
    try {
        const querySnapshot = await getDocs(query(collection(firestore, 'consumer'), where('id', '==', id)));
        if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            await setDoc(docRef, data, { merge: true });
            return true
        } else {
            throw new Error('Consumer record not found');
        }
    }
    catch (error) {
        throw error
    }
}

export const updateBalance = async (id, newBalance, trail) => {
    try {
        const querySnapshot = await getDocs(query(collection(firestore, 'consumer'), where('id', '==', id)));
        if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            await setDoc(docRef, { currentBalance: newBalance }, { merge: true });
            await addDoc(collection(firestore, 'trail'), trail);
            return true
        } else {
            throw new Error('Consumer record not found');
        }
    }
    catch (error) {
        throw error
    }
}