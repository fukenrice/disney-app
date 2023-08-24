import {initializeApp} from "firebase/app";
import {getFirestore, doc, setDoc, getDoc} from "firebase/firestore";
import 'firebase/compat/auth';
import firebase from 'firebase/compat/app';
import {firebaseConfig} from "./secrets";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional


// Initialize Firebase

const app = firebase.apps.length === 0 ? firebase.initializeApp(firebaseConfig) : firebase.app()
const auth = firebase.auth()
const db = getFirestore(app)

export {auth, app, db, getFirestore, doc, setDoc, getDoc}
