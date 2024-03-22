import { query, getDocs, setDoc, collection, doc, getDoc, where } from "firebase/firestore";
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { firestore, auth } from '../Utils/Firebase'
import { currentDateTimestamp } from '../Utils/Common'

let uid = ""

export const getStores = async (userDetails, toggleState) => {
    try {
        console.log("User type:", userDetails.type);
        console.log("Toggle state:", toggleState);
        
        const storeCollection = collection(firestore, 'store');
        let storeQuery = storeCollection;

        // Apply status filter based on toggleState
        if (toggleState === 'active') {
            storeQuery = query(storeQuery, where('status', '==', 'active'));
        } else if (toggleState === 'pending') {
            storeQuery = query(storeQuery, where('status', '==', 'pending'));
        } else if (toggleState === 'rejected') {
            storeQuery = query(storeQuery, where('status', '==', 'rejected'));
        }

        // If user is client, add filter by lguId
        if (userDetails.type === 'client') {
            storeQuery = query(storeQuery, where('lguId', '==', userDetails.id));
        }

        const querySnapshot = await getDocs(storeQuery);
        const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return data;
    } catch (error) {
        console.error('Error fetching stores:', error);
        return [];
    }
};


export const updateStore = async (storeId, updatedStoreData) => {
    try {
        await setDoc(doc(firestore, 'store', storeId), updatedStoreData, { merge: true });
    } catch (error) {
        console.error("Error updating store:", error);
        throw error;
    }
};

export const getStore = async (id) => {
    try {
        const storeRef = doc(firestore, 'store', id);
        const storeDoc = await getDoc(storeRef);

        if (storeDoc.exists()) {
            return { id: storeDoc.id, ...storeDoc.data() };
        } else {
            throw new Error('Store not found');
        }
    }
    catch (error) {
        console.error('Error fetching store:', error);
        throw error;
    }
}

export const getRewardsPerStore = async (id) => {
    try {
        console.log(id)
        const rewardCollection = collection(firestore, 'reward');
        const rewardQuery = query(rewardCollection, where('storeId', '==', id));
        const querySnapshot = await getDocs(rewardQuery);
        const rewards = [];
        querySnapshot.forEach((doc) => {
            rewards.push(doc.data());
        });
        return rewards;
    }
    catch (error) {
        console.error('Error fetching rewards:', error);
        throw error;
    }
}

export const getPromosPerStore = async (id) => {
    try {
        const rewardCollection = collection(firestore, 'promo');
        const promoQuery = query(rewardCollection, where('storeId', '==', id));
        const querySnapshot = await getDocs(promoQuery);
        const promos = [];
        querySnapshot.forEach((doc) => {
            promos.push(doc.data());
        });
        return promos;
    }
    catch (error) {
        console.error('Error fetching rewards:', error);
        throw error;
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