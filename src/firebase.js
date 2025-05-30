import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDtaozrbrLLQ5vMjDDTdEb1KRSsHCdVVvM",
  authDomain: "prjrecibos.firebaseapp.com",
  projectId: "prjrecibos",
  storageBucket: "prjrecibos.firebasestorage.app",
  messagingSenderId: "492177809530",
  appId: "1:492177809530:web:45b396881cfaa88cac1bc3",
  measurementId: "G-MLSQ9SSKYH"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
