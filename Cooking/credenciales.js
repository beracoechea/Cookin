import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage'



// Inicializa Firebase

const firebaseConfig = {
    apiKey: "AIzaSyC7e3BtLM9TdzxXKQU54YAR6QLbk7Mu7v0",
    authDomain: "cooking-1d28d.firebaseapp.com",
    projectId: "cooking-1d28d",
    storageBucket: "cooking-1d28d.appspot.com",
    messagingSenderId: "798269608528",
    appId: "1:798269608528:android:43bd4922f57e6490e5f755"
  };


export const FIREBASE_APP = initializeApp(firebaseConfig);

// initialize Firebase Auth for that app immediately
const auth = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);

