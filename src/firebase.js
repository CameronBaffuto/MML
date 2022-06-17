import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4pwz7Y0QECI3GFcroWbi6jRWSnLV9PiY",
  authDomain: "mom-meds.firebaseapp.com",
  databaseURL: "https://mom-meds-default-rtdb.firebaseio.com",
  projectId: "mom-meds",
  storageBucket: "mom-meds.appspot.com",
  messagingSenderId: "517604121111",
  appId: "1:517604121111:web:21be15de1efd2a52e31a52"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);