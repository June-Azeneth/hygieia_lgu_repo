import { query, getDocs, setDoc, doc, collection, getDoc, where, updateDoc } from "firebase/firestore";
import { firestore } from '../Utils/Firebase'
import { currentDateTimestamp } from "../Utils/Common";

export const getAllAnnouncements = async () => {
    try {
        const announcementQuery = query(collection(firestore, 'announcement'), where('status', '==', "active"))

        const querySnapshot = await getDocs(announcementQuery);

        const announcements = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return announcements;
    } catch (error) {
        return [];
    }
}

export const updateAnnouncement = async (id, update) => {
    try {
        // Get a reference to the announcement document
        const announcementDocRef = doc(collection(firestore, 'announcement'), id);

        // Check if the document already exists
        const announcementDocSnapshot = await getDoc(announcementDocRef);

        if (announcementDocSnapshot.exists()) {
            // Update the existing document with the new data
            await setDoc(announcementDocRef, update, { merge: true });
        }
        return true;
    }
    catch (error) {
        throw error
    }
}

export const deleteAnnouncement = async (id) => {
    try {
        const announcementRef = doc(firestore, 'announcement', id);
        const announcementSnapshot = await getDoc(announcementRef);

        if (announcementSnapshot.exists()) {
            await updateDoc(announcementRef, { status: "deleted" });
            return true;
        }
    }
    catch (error) {
        throw error
    }
}

export const createAnnouncement = async (data) => {
    try {
        const userCollectionRef = collection(firestore, 'announcement');
        await setDoc(doc(userCollectionRef), data);
        return true;
    } catch (error) {
        throw error;
    }
};
