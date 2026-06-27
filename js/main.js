// ===============================
// Main JavaScript
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    console.log("Conference System Started");

    pageAnimation();

});

// ===============================
// Page Animation
// ===============================

function pageAnimation() {

    const buttons = document.querySelectorAll(".main-btn");

    buttons.forEach((btn, index) => {

        btn.style.opacity = "0";
        btn.style.transform = "translateY(40px)";

        setTimeout(() => {

            btn.style.transition = ".5s";

            btn.style.opacity = "1";
            btn.style.transform = "translateY(0)";

        }, index * 180);

    });

}

// ===============================
// Toast Message
// ===============================

function showToast(message, color = "#2A7A4B") {

    let toast = document.querySelector(".toast");

    if (!toast) {

        toast = document.createElement("div");

        toast.className = "toast";

        document.body.appendChild(toast);

    }

    toast.innerHTML = message;

    toast.style.background = color;

    toast.style.display = "block";

    setTimeout(() => {

        toast.style.display = "none";

    }, 3000);

}

// ===============================
// Go To Page
// ===============================

function goTo(page) {

    window.location.href = page;

}

// ===============================
// Back
// ===============================

function goBack() {

    history.back();

}

// ===============================
// Save LocalStorage
// ===============================

function saveData(key, value) {

    localStorage.setItem(key, JSON.stringify(value));

}

// ===============================
// Load LocalStorage
// ===============================

function loadData(key) {

    const data = localStorage.getItem(key);

    if (data) {

        return JSON.parse(data);

    }

    return null;

}

// ===============================
// Remove Data
// ===============================

function removeData(key) {

    localStorage.removeItem(key);

}

// ===============================
// Generate ID
// ===============================

function generateID() {

    return Date.now();

}