import { collection, query, getDocs, getDoc, doc, where, orderBy } from 'firebase/firestore';
import { firestore } from '../Utils/Firebase';


export const getTransactions = async () => {
    try {
        const transactionCollection = collection(firestore, 'transaction');
        const transactionQuery = query(transactionCollection, orderBy('addedOn', 'desc')); // Order by date in descending order

        const querySnapshot = await getDocs(transactionQuery);
        const transactions = [];

        for (const docSnapshot of querySnapshot.docs) {
            const transactionData = docSnapshot.data();
            const customerId = transactionData.customerId;
            const storeId = transactionData.storeId;

            const customerData = await getField('consumer', 'id', customerId);
            const customerName = customerData.length > 0 ? `${customerData[0].firstName} ${customerData[0].lastName}` : 'Unknown Customer';

            const storeData = await getField('store', 'storeId', storeId);
            const storeName = storeData.length > 0 ? storeData[0].name : 'Unknown Store';

            // Check if the transaction has a grant type or promo name
            if (transactionData.type !== "grant" && !transactionData.promoName) {
                // Fetch products only if they exist
                const productsCollection = collection(docSnapshot.ref, 'products');
                const productsQuery = await getDocs(productsCollection);
                const products = productsQuery.docs.map(doc => doc.data());

                const transaction = {
                    id: docSnapshot.id,
                    customerName: customerName,
                    storeName: storeName,
                    products: products.length > 0 ? products : [], // Add products if available, otherwise empty array
                    ...transactionData
                };
                transactions.push(transaction);
            } else {
                // Transaction has a grant type or promo name, include it without products
                const transaction = {
                    id: docSnapshot.id,
                    customerName: customerName,
                    storeName: storeName,
                    products: [], // No products for this transaction
                    ...transactionData
                };
                transactions.push(transaction);
            }
        }
        return { transactions };
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
    }
};


