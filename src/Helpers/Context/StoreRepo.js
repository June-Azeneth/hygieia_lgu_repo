import { query, getDocs, addDoc, setDoc, collection, doc, getDoc, where } from "firebase/firestore";
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { firestore, auth } from '../Utils/Firebase'
import { currentDateTimestamp } from '../Utils/Common'

export const getStores = async (userDetails, toggleState) => {
    try {
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
        // if (userDetails.type === 'client') {
        //     storeQuery = query(storeQuery, where('lguId', '==', userDetails.id));
        // }

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

export const getStoreByID = async (toggleState, searchId) => {
    try {
        if (toggleState === "active") {
            const storeCollection = collection(firestore, 'store');
            const storeQuery = query(
                storeCollection,
                where('storeId', '==', searchId),
                where('status', '==', toggleState)
            );

            const storeDocSnapshot = await getDocs(storeQuery);

            if (!storeDocSnapshot.empty) {
                // Only return the first document if found
                const doc = storeDocSnapshot.docs[0];
                return {
                    id: doc.id,
                    ...doc.data()
                };
            } else {
                return null; // Return null if no document is found
            }
        }
        else {
            const docRef = doc(firestore, "store", searchId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const storeData = docSnap.data();
                if (storeData.status === toggleState) {
                    return {
                        id: docSnap.id,
                        ...storeData
                    };
                }
            }
            return null; // Return null if no document is found or status doesn't match
        }
    }
    catch (error) {
        throw error;
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
        const rewardCollection = collection(firestore, 'reward');
        const rewardQuery = query(
            rewardCollection,
            where('storeId', '==', id),
            where('status', '==', 'active') // Add condition for active rewards
        );
        const querySnapshot = await getDocs(rewardQuery);
        const rewards = [];
        querySnapshot.forEach((doc) => {
            rewards.push(doc.data());
        });
        return rewards;
    } catch (error) {
        console.error('Error fetching rewards:', error);
        throw error;
    }
};

export const getPromosPerStore = async (id) => {
    try {
        const rewardCollection = collection(firestore, 'promo');
        const promoQuery = query(
            rewardCollection,
            where('storeId', '==', id),
            where('status', '==', 'active')
        );
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

export const registerStore = async (documentId, email, password) => {
    try {
        if (password.length < 6) {
            throw new Error("Password should be at least 6 characters");
        }

        const documentRef = doc(firestore, 'store', documentId);
        const credentials = {
            email: email,
            password: password
        }
        const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
        const user = userCredential.user;
        const uid = user.uid;

        await setDoc(documentRef, {
            dateJoined: currentDateTimestamp,
            status: "active",
            storeId: uid
        }, { merge: true });

        return true;
    } catch (error) {
        throw error;
    }
}

export const addStore = async (email, password, data) => {
    try {
        if (password.length < 6) {
            throw new Error("Password should be at least 6 characters");
        }

        const storeCollectionRef = collection(firestore, 'store');

        const credentials = {
            email: email,
            password: password
        }

        const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
        const user = userCredential.user;
        const uid = user.uid;

        const newStoreRef = await addDoc(storeCollectionRef, {
            ...data,
            storeId: uid,
            email: email,
            dateJoined: currentDateTimestamp,
            status: "active"
        });
        return true;
    }
    catch (error) {
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