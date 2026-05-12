// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
  getFirestore,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtcnL9gFRkLMhKp0DZFFU4PWQCYEdC1HU",
  authDomain: "grand-compendium.firebaseapp.com",
  projectId: "grand-compendium",
  storageBucket: "grand-compendium.firebasestorage.app",
  messagingSenderId: "512245522496",
  appId: "1:512245522496:web:31f9ff4b72cb8248293fa5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);