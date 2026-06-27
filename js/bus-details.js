// =======================================
// Bus Details
// =======================================

import {
    getBusById,
    getAllBuses,
    updateBusPassengers
} from "./firebaseService.js";

const selectedBusId = localStorage.getItem("selectedBus");

const title = document.getElementById("busTitle");
const bookedCount = document.getElementById("bookedCount");
const progressBar = document.getElementById("progressBar");
const fullName = document.getElementById("fullName");

let bus = null;

// =======================================
// Load Bus Data
// =======================================

(async function init() {

    if (!selectedBusId) {

        window.location.href = "buses.html";

        return;

    }

    bus = await getBusById(selectedBusId);

    if (!bus) {

        showToast("الأوتوبيس غير موجود", "#d94343");

        setTimeout(() => window.location.href = "buses.html", 1200);

        return;

    }

    title.innerText = bus.name;

    updateScreen();

})();

// =======================================
// Update Screen
// =======================================

function updateScreen() {

    bookedCount.innerHTML =
        `${bus.passengers.length} / ${bus.capacity}`;

    let percent = (bus.passengers.length / bus.capacity) * 100;

    progressBar.style.width = percent + "%";

}

// =======================================
// Book Seat
// =======================================

async function bookSeat() {

    if (!bus) return;

    const name = fullName.value.trim();

    if (name === "") {

        showToast("من فضلك اكتب الاسم بالكامل", "#d94343");

        return;

    }

    // إعادة تحميل أحدث بيانات الأوتوبيسات لمنع التكرار

    const allBuses = await getAllBuses();

    for (let b of allBuses) {

        if (b.passengers.includes(name)) {

            showToast("الاسم مسجل بالفعل", "#d94343");

            return;

        }

    }

    const freshBus = allBuses.find(b => b.id === bus.id);

    if (freshBus.passengers.length >= freshBus.capacity) {

        showToast("الأوتوبيس ممتلئ", "#d94343");

        return;

    }

    freshBus.passengers.push(name);

    try {

        await updateBusPassengers(bus.id, freshBus.passengers);

        bus = freshBus;

        updateScreen();

        showToast("تم الحجز بنجاح ✅");

        setTimeout(() => {

            window.location.href = "buses.html";

        }, 1200);

    }

    catch (e) {

        console.log(e);

        showToast("حدث خطأ، حاول مرة أخرى", "#d94343");

    }

}

window.bookSeat = bookSeat;
