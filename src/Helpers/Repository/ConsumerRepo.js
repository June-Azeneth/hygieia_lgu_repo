import { collection, query, getDocs, where, doc, addDoc, setDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { firestore, auth, storage } from '../Utils/Firebase'
import { currentDateTimestamp } from '../Utils/Common'
// import QRCode from 'qrcode.react';
import { updateCurrentUser } from 'firebase/auth';

export const getAllConsumers = async () => {
    try {
        const userQuery = query(
            collection(firestore, 'consumer'),
            where('status', 'in', ['active', 'unauthenticated'])
        );
        const querySnapshot = await getDocs(userQuery);

        const consumers = querySnapshot.docs.map(doc => ({
            ...doc.data()
        }));
        return consumers;
    }
    catch (error) {
        throw error
    }
}

export const getByConsumerID = async (id) => {
    try {
        const ref = collection(firestore, 'consumer');
        const userQuery = query(ref,
            where('id', '==', id),
            where('status', 'in', ['active', 'unauthenticated']));

        const userDocument = await getDocs(userQuery);

        if (!userDocument.empty) {
            const doc = userDocument.docs[0];
            return {
                id: doc.id,
                ...doc.data()
            };
        } else {
            return null;
        }
    }
    catch (error) {
        throw error
    }
}

export const addConsumer = async (email, password, data) => {
    // const originalUser = auth.currentUser;
    // try {
    //     if (password.length < 6) {
    //         throw new Error("Password should be at least 6 characters");
    //     }

    //     const collectionRef = collection(firestore, 'consumer');

    //     const credentials = {
    //         email: email,
    //         password: password
    //     }

    //     const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
    //     const user = userCredential.user;
    //     const uid = user.uid;

    // Generate QR code with UID embedded as text
    // const qrCodeDataURL = QRCode.toDataURL(uid);

    //     // // Upload QR code to Firebase Storage
    //     // const storageRef = ref(storage, `qr_codes/${uid}.png`);
    //     // const qrCodeSnapshot = await uploadString(storageRef, qrCodeDataURL, 'data_url');

    //     // // Get the download URL of the uploaded QR code
    //     // const downloadURL = await getDownloadURL(qrCodeSnapshot.ref);

    //     // Add new document to Firestore with UID and QR code URL

    // const newDoc = await setDoc(doc(collectionRef, uid), {
    //     ...data,
    //     id: uid,
    //     email: email,
    //     // qrCode: downloadURL, // Store the download URL of the QR code
    //     dateJoined: currentDateTimestamp,
    //     status: "active"
    // });

    //     await updateCurrentUser(auth, originalUser);
    //     return true;
    // }
    // catch (error) {
    //     await updateCurrentUser(auth, originalUser);
    //     console.log(error)
    //     throw error;
    // }

    const originalUser = auth.currentUser;
    try {
        if (password.length < 6) {
            throw new Error("Password should be at least 6 characters");
        }

        const collectionRef = collection(firestore, 'consumer');

        const credentials = {
            email: email,
            password: password
        }

        const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
        const user = userCredential.user;
        const uid = user.uid;

        await setDoc(doc(collectionRef, uid), {
            ...data,
            id: uid,
            email: email,
            // qrCode: downloadURL, // Store the download URL of the QR code
            dateJoined: currentDateTimestamp,
            status: "active"
        });

        await updateCurrentUser(auth, originalUser);
        return true;
    } catch (error) {
        await updateCurrentUser(auth, originalUser);
        throw error.message
    }
}

export const uploadQrCode = async (dataUrl, uid) => {
    try {
        const storageRef = ref(storage, `qr_codes/${uid}.png`);
        const qrCodeSnapshot = await uploadString(storageRef, dataUrl, 'data_url');
        const downloadURL = await getDownloadURL(qrCodeSnapshot.ref);
        return downloadURL
    }
    catch (error) {
        throw error
    }
}

export const updloadToFirestore = async (data, uid) => {
    try {
        const collectionRef = collection(firestore, 'consumer');
        await setDoc(doc(collectionRef, uid), {
            ...data
        });
        return true
    }
    catch (error) {
        throw error
    }
}

// export const sendVerificationEmail = async (email) => {
//     try {
//         const actionCodeSettings = {
//             handleCodeInApp: true,
//             url: 'https://hygieia-admin.netlify.app/'
//         };

//         await sendSignInLinkToEmail(auth, email, actionCodeSettings);

//         return true
//     }
//     catch (error) {
//         throw error
//     }
// }

export const deleteConsumerRecord = async (id) => {
    try {
        const querySnapshot = await getDocs(query(collection(firestore, 'consumer'), where('id', '==', id)));
        if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            await setDoc(docRef, { status: "deleted" }, { merge: true });
            return true;
        } else {
            throw new Error('Consumer not found');
        }
    }
    catch (error) {
        throw error
    }
}

export const updateConsumer = async (id, data) => {
    try {
        const querySnapshot = await getDocs(query(collection(firestore, 'consumer'), where('id', '==', id)));
        if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            await setDoc(docRef, data, { merge: true });
            return true
        } else {
            throw new Error('Consumer record not found');
        }
    }
    catch (error) {
        throw error
    }
}

export const updateBalance = async (id, newBalance, trail) => {
    try {

        const numericBalance = Number(newBalance);

        const querySnapshot = await getDocs(query(collection(firestore, 'consumer'), where('id', '==', id)));
        if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            await setDoc(docRef, { currentBalance: numericBalance }, { merge: true });
            await addDoc(collection(firestore, 'trail'), trail);
            return true;
        } else {
            throw new Error('Consumer record not found');
        }
    }
    catch (error) {
        throw error;
    }
}