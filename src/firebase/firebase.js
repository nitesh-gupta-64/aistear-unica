import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore, collection, getDocs, query } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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