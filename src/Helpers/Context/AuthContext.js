import React, { useContext, useEffect, useState } from 'react';
import { auth, firestore } from '../Utils/Firebase';
import { doc, getDoc, query, getDocs, where, collection } from 'firebase/firestore';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    browserSessionPersistence,
    setPersistence,
    updateCurrentUser
} from 'firebase/auth';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [userDetails, setUserDetails] = useState();
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    async function login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const originalUser = auth.currentUser; // Store the original user

            const docRef = doc(firestore, 'user', user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return userCredential;
            } else {
                await signOut(auth);
                setCurrentUser(null);
                throw new Error('Invalid Credentials');
            }
        } catch (error) {
            await signOut(auth);
            setCurrentUser(null);
            console.error('Error signing in:', error);
            throw error;
        }
    }

    function signUp(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setCurrentUser(user);
            setLoading(false);

            if (user) {
                const userCollectionRef = collection(firestore, 'user');
                const querySnapshot = await getDocs(query(userCollectionRef, where('id', '==', user.uid)));

                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    setUserDetails(userData);
                    if (userData.type === 'admin') {
                        setIsAdmin(true);
                    } else {
                        setIsAdmin(false);
                    }
                });

                if (querySnapshot.empty) {
                    console.log('No such document!');
                }
            }

            setPersistence(auth, browserSessionPersistence)
                .then(() => {
                    setCurrentUser(user);
                })
                .catch((error) => {
                    console.error('Error setting persistence:', error);
                });
        });

        return unsubscribe;
    }, []);

    async function logout() {
        try {
            await signOut(auth);
            setCurrentUser(null);
        } catch (error) {
            console.error('Error logging out:', error);
            throw error;
        }
    }

    const value = {
        currentUser,
        userDetails,
        isAdmin,
        login,
        signUp,
        logout
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
