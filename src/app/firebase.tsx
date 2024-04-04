// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0tGsANK_qBdiyU2NOb4HQHz4XscFagNs",
  authDomain: "e-commerce-store-61f99.firebaseapp.com",
  projectId: "e-commerce-store-61f99",
  storageBucket: "e-commerce-store-61f99.appspot.com",
  messagingSenderId: "1991945143",
  appId: "1:1991945143:web:9ae2892b77b7df8d9bd632"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(firebase);

export default db