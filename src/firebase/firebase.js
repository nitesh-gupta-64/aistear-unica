import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

  const firebaseConfig = {
  apiKey: "AIzaSyBiv14b0KD0SyjrEmUaVzQhNtnuU14zPgE",
  authDomain: "aistear-unica.firebaseapp.com",
  projectId: "aistear-unica",
  storageBucket: "aistear-unica.appspot.com",
  messagingSenderId: "780782493776",
  appId: "1:780782493776:web:7abc6f7afe3c63b752b155",
  measurementId: "G-5C3NHVSEGV"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { db, storage, analytics };
