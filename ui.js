import { auth, db } from "./firebase.js";
import { collection, addDoc, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.showSection = function(section){
  document.getElementById("dashboardSection").style.display="none";
  document.getElementById("sessionsSection").style.display="none";
  document.getElementById("usersSection").style.display="none";
  document.getElementById(section+"Section").style.display="block";
}

window.openModal = function(id){
  document.getElementById(id).style.display="flex";
}

window.closeModal = function(id){
  document.getElementById(id).style.display="none";
}

window.createSession = async function(){
  await addDoc(collection(db,"sessionsMenus"),{
    nom: sessionName.value,
    budget: parseFloat(budget.value),
    coutTotal:0,
    statut:"brouillon",
    createdBy: auth.currentUser.uid
  });
  closeModal("createSessionModal");
  loadSessions();
}

async function loadSessions(){
  const snap = await getDocs(collection(db,"sessionsMenus"));
  sessionsTable.innerHTML="";
  snap.forEach(doc=>{
    sessionsTable.innerHTML += `
    <tr>
      <td>${doc.data().nom}</td>
      <td>${doc.data().budget} €</td>
      <td>${doc.data().coutTotal} €</td>
      <td>${doc.data().statut}</td>
    </tr>`;
  });
}

loadSessions();