import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyCGY2Jyt404sq8pJNG9JtPyYzdSVk3Iudg",
  authDomain: "content-engine-8aac0.firebaseapp.com",
  projectId: "content-engine-8aac0",
  storageBucket: "content-engine-8aac0.appspot.com",
  messagingSenderId: "414210017786",
  appId: "1:414210017786:web:a9eb3b14f18a9cb5f23c43"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)
