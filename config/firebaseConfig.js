import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "cooking-1d28d.firebaseapp.com",
  projectId: "cooking-1d28d",
  storageBucket: "cooking-1d28d.appspot.com",
  messagingSenderId: "798269608528",
  appId: "1:798269608528:web:f58afe26728f724ae5f755"
};


// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Obtén la instancia de Firestore

export { db };
