import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD1ZqD7jrsGuoxA01RRuG4DL7_IleO8XB4",
  authDomain: "rentify-easy.firebaseapp.com",
  projectId: "rentify-easy",
  storageBucket: "rentify-easy.appspot.com",
  messagingSenderId: "311939776863",
  appId: "1:311939776863:web:664781cca8a4ae140836ea",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
