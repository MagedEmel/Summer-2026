import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    getDoc,
    deleteDoc,
    updateDoc,
    doc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD_S9r4f10jedFuYIv2Afly6XWlnSqgQu4",
    authDomain: "kintsogy.firebaseapp.com",
    projectId: "kintsogy",
    storageBucket: "kintsogy.firebasestorage.app",
    messagingSenderId: "1017685753550",
    appId: "1:1017685753550:web:ae9ed91f4d98bb88ae5a9f",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export {
    db,
    collection,
    addDoc,
    getDocs,
    getDoc,
    deleteDoc,
    updateDoc,
    doc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp
};