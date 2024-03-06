import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firestore, auth } from '../Utils/Firebase';


// ...

export const signInUser= async (email, password) => {
 
    
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        window.location.href = '/home'; 
        const user = userCredential.user;
        console.log(userCredential)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
    
    
}

 