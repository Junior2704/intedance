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

const sessionDoc = await getDoc(doc(db,"sessions",sessionId));
const sessionData = sessionDoc.data();

sessionInfo.innerHTML = `
  <div class="card">
    <h3>${sessionData.name}</h3>
    Scouts: ${sessionData.numberOfScouts}<br>
    Allergies: ${sessionData.allergiesGlobal.join(", ")}
  </div>
`;

const mealsSnapshot = await getDocs(collection(db,`sessions/${sessionId}/meals`));

let currentMealId = null;

mealsSnapshot.forEach(docMeal => {
  const meal = docMeal.data();
  if (!meal.isDeleted) {
    mealsContainer.innerHTML += `
      <div class="card">
        <strong>${meal.date} - ${meal.type}</strong><br>
        Scouts: ${meal.numberOfScouts}<br>
        ${meal.tags.map(t=>`<span class="tag">${t}</span>`).join("")}
        <br><br>
        <button onclick="editMeal('${docMeal.id}',${meal.numberOfScouts},'${meal.tags.join(",")}')">
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
  await updateDoc(doc(db,`sessions/${sessionId}/meals/${currentMealId}`), {
    numberOfScouts: Number(editScouts.value),
    tags: editTags.value.split(",")
  });
  location.reload();
};