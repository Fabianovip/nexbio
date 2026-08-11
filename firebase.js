// NexBio Firebase

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyBhsMVZbO5hppO-uPVw9MeR1fCM99cFE-M",
  authDomain: "nexbio-b76fd.firebaseapp.com",
  projectId: "nexbio-b76fd",
  storageBucket: "nexbio-b76fd.firebasestorage.app",
  messagingSenderId: "998963627409",
  appId: "1:998963627409:web:e53c886b5c7e224b2d4630",
  measurementId: "G-TV7TFDK2CV"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


export { auth, db };