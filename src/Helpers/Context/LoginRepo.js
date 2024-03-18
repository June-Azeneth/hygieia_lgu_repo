// import { auth, firestore } from '../Utils/Firebase';
// import {
//   onAuthStateChanged,
//   signInWithEmailAndPassword
// } from "firebase/auth";

// export const signInUser = async (email, password) => {
//   try {
//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;
//     console.log("Success Login");
//     window.location.href = '/home';
//   } catch (error) {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     console.error(errorCode, errorMessage);
//   }
// }

// export const userDetails = () => {
//   return new Promise((resolve, reject) => {
//     onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         const uid = user.uid;
//         try {
//           // Retrieve user document from Firestore
//           const userDoc = await firestore.collection('lgu').doc(uid).get();
//           if (userDoc.exists) {
//             const userData = userDoc.data();
//             resolve(userData.userType); // Resolve with the userType
//           } else {
//             reject(new Error('User document does not exist'));
//           }
//         } catch (error) {
//           reject(error);
//         }
//       } else {
//         reject(new Error('User not logged in'));
//       }
//     });
//   });
// }

