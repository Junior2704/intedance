import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBxXW6RH9paJ66E_8E_bQpR688bTfYvBSY",
  authDomain: "samu-5ede0.firebaseapp.com",
  projectId: "samu-5ede0",
  storageBucket: "samu-5ede0.firebasestorage.app",
  messagingSenderId: "613056086995",
  appId: "1:613056086995:web:d63e43f0ed9334bbb2e526",
  measurementId: "G-251GWK26LC"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);