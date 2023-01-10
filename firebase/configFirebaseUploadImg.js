import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCN5NbhKb6WPPCVf13vBXG7Ee10oC7dKjY",
  authDomain: "upload-image-f8fdc.firebaseapp.com",
  projectId: "upload-image-f8fdc",
  storageBucket: "upload-image-f8fdc.appspot.com",
  messagingSenderId: "95026005523",
  appId: "1:95026005523:web:b5b1d5640ca81cf0f1a1e6",
  measurementId: "G-C6GZSK4CSW",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
