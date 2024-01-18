import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// import { getFirestore } from "firebase/firestore";

// dotenv.config();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBj0FrAaBEW0LSpG5WI_LzEDh0zVaMBag",
  authDomain: "tutorial-4a013.firebaseapp.com",
  projectId: "tutorial-4a013",
  storageBucket: "tutorial-4a013.appspot.com",
  messagingSenderId: "158336079537",
  appId: "1:158336079537:web:97b67f12aedea12a137490",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage();
