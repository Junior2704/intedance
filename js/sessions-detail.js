
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
const db = getFirestore(app);

const params = new URLSearchParams(window.location.search);
const sessionId = params.get("id");

let sessionData = {};

async function loadSession(){
  const snap = await getDoc(doc(db,"sessions",sessionId));
  if(!snap.exists()) return;

  sessionData = snap.data();

  name.value = sessionData.name || "";
  trainer.value = sessionData.trainer || "";
  startDate.value = sessionData.startDate || "";
  endDate.value = sessionData.endDate || "";
  startTime.value = sessionData.startTime || "";
  endTime.value = sessionData.endTime || "";
  location.value = sessionData.location || "";
  capacity.value = sessionData.capacity || "";
  price.value = sessionData.price || "";
  status.value = sessionData.status || "";

  renderMeals();
}

function renderMeals(){
  const list = document.getElementById("mealsList");
  list.innerHTML="";

  if(!sessionData.meals) sessionData.meals=[];

  sessionData.meals.forEach((meal,index)=>{
    list.innerHTML += `
      <div class="meal-card">
        <div>
          <strong>${meal.type}</strong> - ${meal.label}<br>
          <small>${(meal.options || []).join(", ")}</small>
        </div>
        <button class="danger" onclick="deleteMeal(${index})">X</button>
      </div>
    `;
  });
}

window.deleteMeal = function(index){
  sessionData.meals.splice(index,1);
  renderMeals();
}

window.openMealModal = function(){
  mealModal.style.display="flex";
}

window.closeMealModal = function(){
  mealModal.style.display="none";
}

window.addMeal = function(){
  const newMeal = {
    type: mealType.value,
    label: mealLabel.value,
    options: mealOptions.value.split(",").map(o=>o.trim())
  };

  if(!sessionData.meals) sessionData.meals=[];
  sessionData.meals.push(newMeal);

  closeMealModal();
  renderMeals();
}

window.saveSession = async function(){
  await updateDoc(doc(db,"sessions",sessionId),{
    name:name.value,
    trainer:trainer.value,
    startDate:startDate.value,
    endDate:endDate.value,
    startTime:startTime.value,
    endTime:endTime.value,
    location:location.value,
    capacity:Number(capacity.value),
    price:Number(price.value),
    status:status.value,
    meals: sessionData.meals
  });

  alert("Session mise à jour !");
}

loadSession();