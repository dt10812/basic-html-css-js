import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAKgBLwvRY2GEp3VL9ccxar9myFitXlV64",
  authDomain: "ads-ai-f5ff3.firebaseapp.com",
  projectId: "ads-ai-f5ff3",
  storageBucket: "ads-ai-f5ff3.firebasestorage.app",
  messagingSenderId: "808562910634",
  appId: "1:808562910634:web:1848d8b084d56a3b6377d3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

