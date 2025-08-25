// FireBase Config


import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use



const firebaseConfig = {

  apiKey: "AIzaSyDl6twsV8mMqBDNaGPO6tgq3ZzjBc_DmVc",

  authDomain: "jaama-masjid-mustafa.firebaseapp.com",

  projectId: "jaama-masjid-mustafa",

  storageBucket: "jaama-masjid-mustafa.firebasestorage.app",

  messagingSenderId: "1083706166275",

  appId: "1:1083706166275:web:ebce8026fe8fce762bd236",

  measurementId: "G-8NZGM00N9W"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore()

export {
  app,
  db,
  collection,
  addDoc,
  setDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy
};