import { collection, query, getDocs, where } from 'firebase/firestore';
import { firestore } from '../Utils/Firebase';

import { getField } from './TransactionRepo';

export const getRequests = async (userDetails) => {
    try {
        const requestCollection = collection(firestore, 'request');
        const requestQuery = query(requestCollection);

        const querySnapshot = await getDocs(requestQuery);
        const requests = [];

        for (const docSnapshot of querySnapshot.docs) {
            const requestsData = docSnapshot.data();
            const lguId = requestsData.lguId;
            const storeId = requestsData.storeId;
            const status = requestsData.status;

            const userType = userDetails.type;
            const id = userDetails.id;

            const storeData = await getField('store', 'storeId', storeId);
            const storeName = storeData.length > 0 ? `${storeData[0].name}` : 'Unknown Store';

            const lguData = await getField('user', 'id', lguId);
            const lguName = lguData.length > 0 ? `${lguData[0].name}` : 'Unknown Store';

            if (userType === 'client' && id !== lguId) {
                continue;
            }

            if (status !== 'pending') {
                continue;
            }

            const request = {
                id: docSnapshot.id,
                storeName: storeName,
                client: lguName,
                ...requestsData
            };
            requests.push(request);
        }
        return requests;
    }
    catch (error) {
        throw error.message;
    }
}
