// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZksZCR7QvdZOi5gDZakilShIGohTicTM",
  authDomain: "ecommerce-store-e07ea.firebaseapp.com",
  projectId: "ecommerce-store-e07ea",
  storageBucket: "ecommerce-store-e07ea.appspot.com",
  messagingSenderId: "688701502373",
  appId: "1:688701502373:web:1eaf2765bb9cc88233ae4c",
  measurementId: "G-G1CFRGKPEX"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

export default firebase