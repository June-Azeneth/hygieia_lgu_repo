import { collection, query, getDocs, where } from 'firebase/firestore';
import { firestore } from '../Utils/Firebase';

export const getTransactions = async (userDetails) => {
    try {
        const transactionCollection = collection(firestore, 'transaction');
        const transactionQuery = query(transactionCollection);

        const querySnapshot = await getDocs(transactionQuery);
        const transactions = [];

        for (const docSnapshot of querySnapshot.docs) {
            const transactionData = docSnapshot.data();
            const customerId = transactionData.customerId;
            const storeId = transactionData.storeId;

            console.log(userDetails)

            const userType = userDetails.type;
            const id = userDetails.id

            // Fetch customer data
            const customerData = await getField('consumer', 'id', customerId);
            const customerName = customerData.length > 0 ? `${customerData[0].firstName} ${customerData[0].lastName}` : 'Unknown Customer';

            // Fetch store data
            const storeData = await getField('store', 'storeId', storeId);
            const storeLguId = storeData.length > 0 ? storeData[0].lguId : null;
            const storeName = storeData.length > 0 ? storeData[0].name : 'Unknown Store';

            if(userType === 'client' && id !== storeLguId){
                continue;
            }

            // Construct the transaction object with additional information
            const transaction = {
                id: docSnapshot.id,
                customerName: customerName,
                storeName: storeName,
                ...transactionData
            };
            transactions.push(transaction);
        }
        console.log(transactions);
        return transactions;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }
};


const getField = async (collectionName, fieldName, fieldValue) => {
    try {
        const documentsRef = collection(firestore, collectionName);
        const querySnapshot = await getDocs(query(documentsRef, where(fieldName, '==', fieldValue)));

        const documents = [];
        querySnapshot.forEach(doc => {
            documents.push({ id: doc.id, ...doc.data() });
        });

        return documents;
    } catch (error) {
        console.error('Error getting documents by field:', error);
        return [];
    }
};


