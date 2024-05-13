import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBgRvIW4YahLh1t9as_ItRsW_skdjzSw_s",
  authDomain: "ai-generate-content-167af.firebaseapp.com",
  projectId: "ai-generate-content-167af",
  storageBucket: "ai-generate-content-167af.appspot.com",
  messagingSenderId: "599434954092",
  appId: "1:599434954092:web:9a4ef579866897f063df49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)

