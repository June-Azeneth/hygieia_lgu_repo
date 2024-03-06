import { auth } from '../Utils/Firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword
} from "firebase/auth";

export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Success Login");
    window.location.href = '/home';
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);
  }
}

export function userDetails(){
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      console.log(uid);
      return uid
      // ...
    } else {
      // User is signed out
      // ...
    }
  });
}

