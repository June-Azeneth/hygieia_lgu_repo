import { collection, query, getDocs, where } from 'firebase/firestore';
import { firestore } from '../Utils/Firebase';
import { client } from '../../Components/Navbar/SidebarData';

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


// FOR ADMIN
export const getClients = async () => {
    try {
        const userQuery = query(collection(firestore, 'user'), where('type', '==', 'client'));
        const querySnapshot = await getDocs(userQuery);

        const clients = querySnapshot.docs.map(doc => ({
            ...doc.data()
        }));
        console.log(clients)
        return clients;
    }
    catch (error) {
        throw error.message
    }
}