import { query, getDocs, addDoc, setDoc, collection, doc, getDoc, where } from "firebase/firestore";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { firestore, auth } from '../Utils/Firebase'
import { currentDateTimestamp } from '../Utils/Common'
// import { getUnixTime } from 'date-fns';
// import { Timestamp } from 'firebase/firestore';

import { updateCurrentUser } from "firebase/auth";

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
        throw error;
    }
};

export const getPromosPerStore = async (id) => {
    try {
        const currentDate = new Date();
        const rewardCollection = collection(firestore, 'promo');
        const promoQuery = query(
            rewardCollection,
            where('storeId', '==', id),
            where('status', '==', 'active')
        );
        const querySnapshot = await getDocs(promoQuery);
        const promos = [];

        querySnapshot.forEach((doc) => {
            const promoData = doc.data();
            const promoEndTimestamp = promoData.promoEnd.toDate();
            if (promoEndTimestamp >= currentDate) {
                promos.push(promoData);
            }
        });

        return promos;
    }
    catch (error) {
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
            storeId: uid,
            photo: "https://firebasestorage.googleapis.com/v0/b/hygieiadb-44a6b.appspot.com/o/stores%2Fstore_no_photo_placeholder.jpg?alt=media&token=4be438e4-1084-4f18-bcf2-a91f9ad51dd9"
        }, { merge: true });

        return true;
    } catch (error) {
        throw error;
    }
}

export const addStore = async (email, password, data) => {
    const originalUser = auth.currentUser;
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

        await addDoc(storeCollectionRef, {
            ...data,
            storeId: uid,
            email: email,
            dateJoined: currentDateTimestamp,
            photo: "https://firebasestorage.googleapis.com/v0/b/hygieiadb-44a6b.appspot.com/o/stores%2Fstore_no_photo_placeholder.jpg?alt=media&token=4be438e4-1084-4f18-bcf2-a91f9ad51dd9",
            status: "active"
        });
        await updateCurrentUser(auth, originalUser);
        return true;
    }
    catch (error) {
        await updateCurrentUser(auth, originalUser);
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
        throw error;
    }
}