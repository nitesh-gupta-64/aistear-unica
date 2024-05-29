import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Main Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyBiv14b0KD0SyjrEmUaVzQhNtnuU14zPgE",
//   authDomain: "aistear-unica.firebaseapp.com",
//   projectId: "aistear-unica",
//   storageBucket: "aistear-unica.appspot.com",
//   messagingSenderId: "780782493776",
//   appId: "1:780782493776:web:7abc6f7afe3c63b752b155",
//   measurementId: "G-5C3NHVSEGV"
// };

// Demo Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBg75ZxxDkY49mt15VJLQUNzWBrc6JAyVE",
    authDomain: "aistear-unica-33f55.firebaseapp.com",
    projectId: "aistear-unica-33f55",
    storageBucket: "aistear-unica-33f55.appspot.com",
    messagingSenderId: "873344322738",
    appId: "1:873344322738:web:2c9f60febcd93161590dab"
  };
  

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

const db = getFirestore(app);
const storage = getStorage(app);

export { db,storage };