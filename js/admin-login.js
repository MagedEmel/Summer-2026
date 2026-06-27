import {
  db,
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  onSnapshot,
} from "./firebase.js";

// =====================================
// Admin Login
// =====================================
let ADMIN_PASSWORD;
// يمكنك تغيير كلمة المرور هنا
async function getAdminPassword() {
  const docRef = doc(db, "admin", "pass");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    ADMIN_PASSWORD = docSnap.data().password; // 👈 ده الـ password
    return docSnap.data().password;
  } else {
    console.log("No such document!");
  }
}
// =====================================

async function loginAdmin() {
    const password = document.getElementById("adminPassword").value.trim();

    const adminPassword = await getAdminPassword();

    if (password !== adminPassword) {
        showToast("كلمة المرور غير صحيحة", "#d94343");
        return;
    }

    localStorage.setItem("adminLogged", "true");
    window.location.href = "admin.html";
}
window.loginAdmin = loginAdmin;
// =====================================
// Enter Key
// =====================================

document
  .getElementById("adminPassword")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      loginAdmin();
    }
  });
