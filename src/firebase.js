import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBoq6dNTx5NeD8vK5diVkxo5aKXpk07gsc",
    authDomain: "yappareports.firebaseapp.com",
    databaseURL: "https://yappareports.firebaseio.com",
    projectId: "yappareports",
    storageBucket: "yappareports.appspot.com",
    messagingSenderId: "660964690119",
    appId: "1:660964690119:web:2136f0e20e1aac24e656e2",
    measurementId: "G-WWQQKE5Z78"
};

firebase.initializeApp(firebaseConfig);

export default firebase;