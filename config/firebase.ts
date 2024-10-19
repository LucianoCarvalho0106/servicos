
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import {getStorage} from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyA_EWfzhxTIrC1jjwORZbHJD0O8q1BdxMg",
  authDomain: "servicos-13706.firebaseapp.com",
  projectId: "servicos-13706",
  storageBucket: "servicos-13706.appspot.com",
  messagingSenderId: "1047966707151",
  appId: "1:1047966707151:web:890f5c77a1e331021c76ba"
};

const app = initializeApp(firebaseConfig);
 const db = getFirestore(app);
 const auth = getAuth(app);
 const storage = getStorage(app);
 const provider = new GoogleAuthProvider();
 export {db,auth,provider,storage};