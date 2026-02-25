import { db } from "./firebase-config.js";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get("id");

if (!sessionId) {
  alert("Session introuvable");
  window.location.href = "sessions.html";
}

const sessionDoc = await getDoc(doc(db, "sessions", sessionId));

if (!sessionDoc.exists()) {
  alert("Session inexistante");
  window.location.href = "sessions.html";
}

const sessionData = sessionDoc.data();

// 🔐 Sécurisation allergies
const allergies = Array.isArray(sessionData.allergiesGlobal)
  ? sessionData.allergiesGlobal
  : [];

sessionInfo.innerHTML = `
  <div class="card">
    <h3>${sessionData.name || "Session"}</h3>
    Scouts: ${sessionData.numberOfScouts || 0}<br>
    Allergies: ${allergies.length > 0 ? allergies.join(", ") : "Aucune"}
  </div>
`;

const mealsSnapshot = await getDocs(
  collection(db, `sessions/${sessionId}/meals`)
);

let currentMealId = null;

mealsContainer.innerHTML = "";

mealsSnapshot.forEach(docMeal => {
  const meal = docMeal.data();

  if (!meal.isDeleted) {

    const tags = Array.isArray(meal.tags) ? meal.tags : [];

    mealsContainer.innerHTML += `
      <div class="card">
        <strong>${meal.date} - ${meal.type}</strong><br>
        Scouts: ${meal.numberOfScouts || 0}<br>
        ${tags.map(t => `<span class="tag">${t}</span>`).join("")}
        <br><br>
        <button onclick="editMeal('${docMeal.id}', ${meal.numberOfScouts || 0}, '${tags.join(",")}')">
          Modifier
        </button>
      </div>
    `;
  }
});

window.editMeal = (id, scouts, tags) => {
  currentMealId = id;
  editScouts.value = scouts;
  editTags.value = tags;
  document.getElementById("mealModal").style.display = "flex";
};

document.getElementById("saveMealBtn").onclick = async () => {

  const updatedTags = editTags.value
    .split(",")
    .map(t => t.trim())
    .filter(t => t !== "");

  await updateDoc(
    doc(db, `sessions/${sessionId}/meals/${currentMealId}`),
    {
      numberOfScouts: Number(editScouts.value),
      tags: updatedTags
    }
  );

  location.reload();
};