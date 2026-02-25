import { auth, db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const modal = document.getElementById("sessionModal");
document.getElementById("openModal").onclick = () => modal.style.display = "flex";

document.getElementById("createSessionBtn").onclick = async () => {

  const name = nameInput.value;
  const start = startInput.value;
  const end = endInput.value;
  const scouts = Number(scoutsInput.value);
  const allergies = allergiesInput.value.split(",");

  const sessionRef = await addDoc(collection(db, "sessions"), {
    name,
    startDate: start,
    endDate: end,
    numberOfScouts: scouts,
    allergiesGlobal: allergies,
    adminId: auth.currentUser.uid,
    createdAt: new Date()
  });

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
        isDeleted: false
      });
    }
  }

  modal.style.display = "none";
  location.reload();
};

const snapshot = await getDocs(collection(db,"sessions"));
snapshot.forEach(doc => {
  if (doc.data().adminId === auth.currentUser.uid) {
    sessionsList.innerHTML += `
      <div class="card" onclick="location.href='session-detail.html?id=${doc.id}'">
        <strong>${doc.data().name}</strong><br>
        ${doc.data().startDate} → ${doc.data().endDate}
      </div>
    `;
  }
});