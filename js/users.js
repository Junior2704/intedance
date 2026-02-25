import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDocs,
  collection
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const modal = document.getElementById("userModal");
document.getElementById("openUserModal").onclick = () => modal.style.display = "flex";

document.getElementById("createUser").onclick = async () => {

  const email = newEmail.value;
  const role = newRole.value;
  const tempPassword = "Temp1234!";

  const userCred = await createUserWithEmailAndPassword(auth, email, tempPassword);

  await setDoc(doc(db, "users", userCred.user.uid), {
    email,
    role,
    createdAt: new Date()
  });

  alert("Utilisateur créé");
  modal.style.display = "none";
};

const snapshot = await getDocs(collection(db,"users"));
snapshot.forEach(doc => {
  usersList.innerHTML += `
    <div class="card">
      ${doc.data().email} - ${doc.data().role}
    </div>
  `;
});