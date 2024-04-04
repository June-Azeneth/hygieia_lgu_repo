import { collection, query, getDocs, getDoc, doc, where, orderBy } from 'firebase/firestore';
import { firestore } from '../Utils/Firebase';

// export const getTransactions = async () => {
//     try {
//         const transactionCollection = collection(firestore, 'transaction');
//         const transactionQuery = query(transactionCollection);

//         const querySnapshot = await getDocs(transactionQuery);
//         const transactions = [];

//         for (const docSnapshot of querySnapshot.docs) {
//             const transactionData = docSnapshot.data();
//             const customerId = transactionData.customerId;
//             const storeId = transactionData.storeId;

//             // const userType = userDetails.type;
//             // const id = userDetails.id

//             const customerData = await getField('consumer', 'id', customerId);
//             const customerName = customerData.length > 0 ? `${customerData[0].firstName} ${customerData[0].lastName}` : 'Unknown Customer';

//             const storeData = await getField('store', 'storeId', storeId);
//             // const storeLguId = storeData.length > 0 ? storeData[0].lguId : null;
//             const storeName = storeData.length > 0 ? storeData[0].name : 'Unknown Store';

//             // if (userType === 'client' && id !== storeLguId) {
//             //     continue;
//             // }    

//             const transaction = {
//                 id: docSnapshot.id,
//                 customerName: customerName,
//                 storeName: storeName,
//                 ...transactionData
//             };
//             transactions.push(transaction);
//         }
//         return transactions;
//     } catch (error) {
//         throw error
//         return [];
//     }
// };


export const getTransactions = async () => {
    try {
        const transactionCollection = collection(firestore, 'transaction');
        const transactionQuery = query(transactionCollection, orderBy('addedOn', 'desc')); // Order by date in descending order

        const querySnapshot = await getDocs(transactionQuery);
        const transactions = [];
        let totalTransactions = 0;

        for (const docSnapshot of querySnapshot.docs) {
            const transactionData = docSnapshot.data();
            const customerId = transactionData.customerId;
            const storeId = transactionData.storeId;

            const customerData = await getField('consumer', 'id', customerId);
            const customerName = customerData.length > 0 ? `${customerData[0].firstName} ${customerData[0].lastName}` : 'Unknown Customer';

            const storeData = await getField('store', 'storeId', storeId);
            const storeName = storeData.length > 0 ? storeData[0].name : 'Unknown Store';

            const transaction = {
                id: docSnapshot.id,
                customerName: customerName,
                storeName: storeName,
                ...transactionData
            };
            transactions.push(transaction);
            totalTransactions++;
        }

        //Calculate total commision fee
        const transactionFee = totalTransactions * 0.2;

        return { transactions, totalTransactions, transactionFee };
    } catch (error) {
        throw error;
    }
};



export const getTransactionByID = async (searchID) => {
    try {
        const ref = doc(firestore, 'transaction', searchID);
        const transactionDoc = await getDoc(ref);

        if (transactionDoc.exists()) {
            const transactionData = transactionDoc.data();
            const customerId = transactionData.customerId;
            const storeId = transactionData.storeId;

            const customerData = await getField('consumer', 'id', customerId);
            const customerName = customerData.length > 0 ? `${customerData[0].firstName} ${customerData[0].lastName}` : 'Unknown Customer';

            const storeData = await getField('store', 'storeId', storeId);
            const storeName = storeData.length > 0 ? storeData[0].name : 'Unknown Store';

            return {
                id: transactionDoc.id,
                customerName: customerName,
                storeName: storeName,
                ...transactionData
            };
        } else {
            throw new Error('Transaction not found');
        }
    } catch (error) {
        throw error;
    }
};

export const getField = async (collectionName, fieldName, fieldValue) => {
    try {
        const documentsRef = collection(firestore, collectionName);
        const querySnapshot = await getDocs(query(documentsRef, where(fieldName, '==', fieldValue)));

        const documents = [];
        querySnapshot.forEach(doc => {
            documents.push({ id: doc.id, ...doc.data() });
        });
        return documents;
    } catch (error) {
        throw error
        return [];
    }
};


