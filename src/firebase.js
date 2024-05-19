import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC2sSunWbchby1_DaxruHCTTDd4xsV_z4A",
    authDomain: "category-tree-6465a.firebaseapp.com",
    projectId: "category-tree-6465a",
    storageBucket: "category-tree-6465a.appspot.com",
    messagingSenderId: "66205469365",
    appId: "1:66205469365:web:f9e41e36254f6864904cfc",
    measurementId: "G-T31LZC8HDE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };