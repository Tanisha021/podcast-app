// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import {getAuth} from "firebase/auth"
import {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyC98DOcLsv6IVEQrglXaUOlkb7MrYktFmM",
  authDomain: "podcast-app-e0f3e.firebaseapp.com",
  projectId: "podcast-app-e0f3e",
  storageBucket: "podcast-app-e0f3e.appspot.com",
  messagingSenderId: "580486034291",
  appId: "1:580486034291:web:9a002ec44a2df4aa340b06",
  measurementId: "G-YK41F59S0H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export {auth,storage,db}
