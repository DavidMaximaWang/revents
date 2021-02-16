import firebase from "firebase/app"; //not useing whole firebase
import "firebase/firestore";
import "firebase/database";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDEPrGTl21weOnB3AnuMTNa2GqsZ2nJljY",
  authDomain: "revents-252811.firebaseapp.com",
  databaseURL: "https://revents-252811.firebaseio.com",
  projectId: "revents-252811",
  storageBucket: "",
  messagingSenderId: "198632831335",
  appId: "1:198632831335:web:66cecb03d5ef9adbb657c2"
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;
