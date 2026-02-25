import { auth, db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const modal = document.getElementById("sessionModal");
document.getElementById("openModal").onclick = () => modal.style.display = "flex";

document.getElementById("createSession").onclick = async () => {

  const name = nameInput.value;
  const start = startDate.value;
  const end = endDate.value;
  const scouts = Number(scoutsInput.value);
  const allergies = allergies.value.split(",");

  const sessionRef = await addDoc(collection(db, "sessions"), {
    name,
    startDate: start,
    endDate: end,
    numberOfScouts: scouts,
    allergiesGlobal: allergies,
    adminId: auth.currentUser.uid,
    createdAt: new Date()
  });

  // Création automatique repas
  const startDateObj = new Date(start);
  const endDateObj = new Date(end);

  for (let d = new Date(startDateObj); d <= endDateObj; d.setDate(d.getDate() + 1)) {

    const dateStr = d.toISOString().split("T")[0];

    const meals = ["petit-dej","dej","gouter","diner"];

    for (let meal of meals) {
      await addDoc(collection(db, `sessions/${sessionRef.id}/meals`), {
        date: dateStr,
        type: meal,
        numberOfScouts: scouts,
        tags: [],
        isDeleted: false,
        createdAt: new Date()
      });
    }
  }

  modal.style.display = "none";
  location.reload();
};

// Affichage sessions
const snapshot = await getDocs(collection(db, "sessions"));
snapshot.forEach(doc => {
  if (doc.data().adminId === auth.currentUser.uid) {
    sessionsList.innerHTML += `
      <div class="card">
        <strong>${doc.data().name}</strong><br>
        Scouts: ${doc.data().numberOfScouts}<br>
        ${doc.data().startDate} → ${doc.data().endDate}
      </div>
    `;
  }
});