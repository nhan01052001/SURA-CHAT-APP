// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyBxX8_dN58wJ7rkUrj2sS-8SUaqVMB7APA",
  authDomain: "otp-reactnative-ea6ea.firebaseapp.com",
  projectId: "otp-reactnative-ea6ea",
  storageBucket: "otp-reactnative-ea6ea.appspot.com",
  messagingSenderId: "85616313150",
  appId: "1:85616313150:web:39588f5d316ac2f14ae26f",
  measurementId: "G-FTEKMZ0DYD",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
