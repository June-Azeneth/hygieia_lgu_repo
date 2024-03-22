import { collection, query, getDocs, where } from 'firebase/firestore';
import { firestore } from '../Utils/Firebase';

export const getStores = async (userDetails) => {
    try {
        const storesQuery = query(collection(firestore, 'store'), where('lguId', '==', userDetails.id));

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