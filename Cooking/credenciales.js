import { initializeApp } from "firebase/app";

// Inicializa Firebase

const firebaseConfig = {
    apiKey: "AIzaSyC7e3BtLM9TdzxXKQU54YAR6QLbk7Mu7v0",
    authDomain: "cooking-1d28d.firebaseapp.com",
    projectId: "cooking-1d28d",
    storageBucket: "cooking-1d28d.appspot.com",
    messagingSenderId: "798269608528",
    appId: "1:798269608528:android:43bd4922f57e6490e5f755"
  };

const appFirebase = initializeApp(firebaseConfig);

export default appFirebase;