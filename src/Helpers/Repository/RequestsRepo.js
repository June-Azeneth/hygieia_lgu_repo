import { collection, query, getDocs, where, doc, setDoc } from 'firebase/firestore';
import { firestore } from '../Utils/Firebase';
import { startOfDay, endOfDay, addDays, addMonths } from 'date-fns';

import { getField } from './TransactionRepo';

// export const getRequests = async (currentUser) => {
//     try {
//         const requestCollection = collection(firestore, 'request');
//         const requestQuery = query(requestCollection);

// const querySnapshot = await getDocs(requestQuery);
// const requests = [];

// for (const docSnapshot of querySnapshot.docs) {
//     const requestsData = docSnapshot.data();
//     const lguId = requestsData.lguId;
//     const storeId = requestsData.storeId;
//     const status = requestsData.status;

//     const userType = currentUser.type;
//     const id = currentUser.id;

//     const storeData = await getField('store', 'storeId', storeId);
//     const storeName = storeData.length > 0 ? `${storeData[0].name}` : 'Unknown Store';

//     const lguData = await getField('user', 'id', lguId);
//     const lguName = lguData.length > 0 ? `${lguData[0].name}` : 'Unknown Store';

//     if (userType === 'client' && id !== lguId) {
//         continue;
//     }

//     if (status !== 'pending') {
//         continue;
//     }

//     const request = {
//         id: docSnapshot.id,
//         storeName: storeName,
//         client: lguName,
//         ...requestsData
//     };
//     requests.push(request);
// }
//         return requests;
//     }
//     catch (error) {
//         throw error.message;
//     }
// }

export const getRequestCounts = async () => {
    try {
        const currentDate = new Date();
        const todayStart = startOfDay(currentDate);
        const todayEnd = endOfDay(currentDate);
        const tomorrowStart = startOfDay(addDays(currentDate, 1));

        const requestCol = collection(firestore, 'request');

        // Query to get active requests for today
        const todayActiveQuery = query(requestCol, where('status', '==', 'active'), where('date', '>=', todayStart), where('date', '<=', todayEnd));
        const todayActiveSnapshot = await getDocs(todayActiveQuery);
        const todayActiveCount = todayActiveSnapshot.size;

        // Query to get active requests for tomorrow
        const upcomingActiveQuery = query(requestCol, where('status', '==', 'active'), where('date', '>=', tomorrowStart));
        const upcomingActiveSnapshot = await getDocs(upcomingActiveQuery);
        const upcomingActiveCount = upcomingActiveSnapshot.size;

        // Query to get pending requests
        const pendingQuery = query(requestCol, where('status', '==', 'pending'));
        const pendingSnapshot = await getDocs(pendingQuery);
        const pendingCount = pendingSnapshot.size;

        // Query to get completed requests
        const completedQuery = query(requestCol, where('status', '==', 'completed'));
        const completedSnapshot = await getDocs(completedQuery);
        const completedCount = completedSnapshot.size;

        // Create an object to hold the counts
        const requestCounts = {
            today: todayActiveCount,
            upcoming: upcomingActiveCount,
            pending: pendingCount,
            completed: completedCount
        };

        return requestCounts;
    } catch (error) {
        throw error;
    }
};



export const getRequests = async (toggleState) => {
    try {
        const requestCol = collection(firestore, 'request');
        let requestQuery = requestCol;

        // Get current date
        const currentDate = new Date();

        // Apply status filter based on toggleState
        if (toggleState === 'today') {
            const todayStart = startOfDay(currentDate);
            const todayEnd = endOfDay(currentDate);
            requestQuery = query(requestQuery, where('status', '==', 'active'), where('date', '>=', todayStart), where('date', '<=', todayEnd));
        } else if (toggleState === 'upcoming') {
            const todayStart = startOfDay(currentDate);
            const futureEnd = endOfDay(addMonths(currentDate, 1)); // Set the end date to one month from today
            requestQuery = query(requestQuery,
                where('status', '==', 'active'),
                where('date', '>=', todayStart),
                where('date', '<=', futureEnd));
        } else if (toggleState === 'pending') {
            requestQuery = query(requestQuery, where('status', '==', 'pending'));
        } else if (toggleState === 'done') {
            requestQuery = query(requestQuery, where('status', '==', 'completed'));
        }

        const querySnapshot = await getDocs(requestQuery);
        const requests = [];

        for (const docSnapshot of querySnapshot.docs) {
            const requestsData = docSnapshot.data();
            const storeId = requestsData.storeId;

            const storeData = await getField('store', 'storeId', storeId);
            const storeName = storeData.length > 0 ? `${storeData[0].name}` : 'Unknown Store';

            const request = {
                id: docSnapshot.id,
                storeName: storeName,
                ...requestsData
            };
            requests.push(request);
        }

        return requests;
    }
    catch (error) {
        throw error
    }
}

export const markAsActive = async (id) => {
    try {
        const documentRef = doc(firestore, 'request', id);
        await setDoc(documentRef, {
            status: "active"
        }, { merge: true });
        return true;
    }
    catch (error) {
        throw error
    }
}

export const markAsRejected = async (id) => {
    try {
        const documentRef = doc(firestore, 'request', id);
        await setDoc(documentRef, {
            status: "rejected"
        }, { merge: true });
        return true;
    }
    catch (error) {
        throw error
    }
}

export const markAsCompleted = async (id) => {
    try {
        const documentRef = doc(firestore, 'request', id);
        await setDoc(documentRef, {
            status: "completed"
        }, { merge: true });
        return true;
    }
    catch (error) {
        throw error
    }
}


// export const getRequestById = async (toggleState, id) => {
//     try {
//         const currentDate = new Date();
//         let requestQuery = query(doc(firestore, 'request', id));

//         if (toggleState === "today") {
//             const todayStart = startOfDay(currentDate);
//             const todayEnd = endOfDay(currentDate);
//             requestQuery = query(requestQuery, where('status', '==', 'active'), where('date', '>=', todayStart), where('date', '<=', todayEnd));
//         } else if (toggleState === "upcoming") {
//             const tomorrowStart = startOfDay(new Date(currentDate.setDate(currentDate.getDate() + 1)));
//             const tomorrowEnd = endOfDay(new Date(currentDate.setDate(currentDate.getDate() + 1)));
//             requestQuery = query(requestQuery, where('status', '==', 'active'), where('date', '>=', tomorrowStart), where('date', '<=', tomorrowEnd));
//         } else if (toggleState === "pending") {
//             requestQuery = query(requestQuery, where('status', '==', 'pending'));
//         } else {
//             requestQuery = query(requestQuery, where('status', '==', 'completed'));
//         }

//         const requestDocSnapshot = await getDocs(requestQuery);
//         if (!requestDocSnapshot.empty) {
//             const doc = requestDocSnapshot.docs[0];
//             return {
//                 id: doc.id,
//                 ...doc.data()
//             };
//         } else {
//             return null;
//         }
//     } catch (error) {
//         throw error;
//     }
// };
