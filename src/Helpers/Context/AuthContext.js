import React, { useContext, useEffect, useState } from 'react'
import { auth, firestore } from '../Utils/Firebase'
import { doc, getDoc } from "firebase/firestore";

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from "firebase/auth";

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [userDetails, setUserDetails] = useState()
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false);

    async function login(email, password) {
        try {
            // Attempt to sign in the user with the provided email and password
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Check if the user exists in the "lgu" collection
            const docRef = doc(firestore, "lgu", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return userCredential;
            } else {
                
                throw new Error("Invalid Credentials");
            }
        } catch (error) {
            // Handle any errors that occur during the sign-in process
            console.error("Error signing in:", error);
            throw error;
        }
    }

    function signUp(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setCurrentUser(user);
            setLoading(false);

            if (user) {
                const docRef = doc(firestore, "lgu", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setUserDetails(userData)
                    if (userData.type === "admin") {
                        setIsAdmin(true);
                    } else {
                        setIsAdmin(false);
                    }
                } else {
                    console.log("No such document!");
                }
            }
        });

        return unsubscribe;
    }, []);

    async function logout() {
        try {
            await signOut(auth);
            setCurrentUser(null);
        } catch (error) {
            console.error("Error logging out:", error);
            throw error;
        }
    }

    const value = {
        currentUser,
        userDetails,
        user,
        isAdmin,
        login,
        signUp,
        logout
    }
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
