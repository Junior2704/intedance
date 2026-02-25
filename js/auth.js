import { auth, db } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

if (loginBtn) {
  loginBtn.onclick = async () => {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    window.location.href = "dashboard.html";
  };
}

if (registerBtn) {
  registerBtn.onclick = async () => {
    const user = await createUserWithEmailAndPassword(auth, email.value, password.value);
    await setDoc(doc(db, "users", user.user.uid), {
      email: email.value,
      role: "admin",
      createdAt: new Date()
    });
    alert("Compte Admin créé");
  };
}

onAuthStateChanged(auth, user => {
  if (user && window.location.pathname.includes("index.html")) {
    window.location.href = "dashboard.html";
  }
});