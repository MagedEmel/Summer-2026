// ======================================
// Room Type (List rooms by gender + capacity)
// ======================================

import { watchRoomsByGender } from "./firebaseService.js";

const gender = localStorage.getItem("roomGender");

const pageTitle = document.getElementById("pageTitle");

const capacityContainer = document.getElementById("capacityContainer");
const capacityOptions = document.getElementById("capacityOptions");
const roomsContainer = document.getElementById("roomsContainer");

let allGenderRooms = []; // كل غرف هذا النوع (قبل تصفية العدد)
let selectedCapacity = null;

// ======================================

pageTitle.innerHTML =
    gender == "male"
        ? "غرف الولاد"
        : "غرف البنات";

roomsContainer.innerHTML = `<p style="text-align:center;">جاري التحميل...</p>`;

// ======================================
// Live Listener (كل غرف النوع المختار)
// ======================================

watchRoomsByGender(gender, (data) => {

    allGenderRooms = data;

    renderCapacityOptions();

    if (selectedCapacity !== null) {

        renderRooms();

    }

});

// ======================================
// عرض اختيارات عدد الأفراد
// ======================================

function renderCapacityOptions() {

    const capacities = [...new Set(allGenderRooms.map(r => r.capacity))]
        .sort((a, b) => a - b);

    if (capacities.length === 0) {

        capacityOptions.innerHTML =
            `<p style="text-align:center;">لا توجد غرف متاحة حالياً</p>`;

        return;

    }

    capacityOptions.innerHTML = "";

    capacities.forEach(cap => {

        const total = allGenderRooms.filter(r => r.capacity === cap).length;

        capacityOptions.innerHTML += `

        <button class="btn-gold" style="margin-bottom:15px;" onclick="selectCapacity(${cap})">

            غرف ${cap} أشخاص (${total})

        </button>

        `;

    });

}

// ======================================
// اختيار عدد معين
// ======================================

function selectCapacity(cap) {

    selectedCapacity = cap;

    capacityContainer.style.display = "none";

    roomsContainer.style.display = "block";

    pageTitle.innerHTML =
        (gender == "male" ? "غرف الولاد" : "غرف البنات") +
        ` - ${cap} أشخاص`;

    renderRooms();

}

window.selectCapacity = selectCapacity;

// ======================================
// رجوع لاختيار العدد
// ======================================

function backToCapacity() {

    selectedCapacity = null;

    roomsContainer.style.display = "none";

    capacityContainer.style.display = "block";

    pageTitle.innerHTML =
        gender == "male" ? "غرف الولاد" : "غرف البنات";

}

window.backToCapacity = backToCapacity;

// ======================================
// عرض الغرف (المفلترة بالعدد المختار)
// ======================================

function renderRooms() {

    const rooms = allGenderRooms.filter(r => r.capacity === selectedCapacity);

    roomsContainer.innerHTML = `

    <div class="card">

        <button onclick="backToCapacity()">

            ⬅ تغيير عدد الأفراد

        </button>

    </div>

    `;

    if (rooms.length === 0) {

        roomsContainer.innerHTML += `<div class="card"><p style="text-align:center;">لا توجد غرف متاحة حالياً بهذا العدد</p></div>`;

        return;

    }

    rooms.forEach(room => {

        const booked = room.occupants.length;

        const full = booked >= room.capacity;

        const percent = (booked / room.capacity) * 100;

        roomsContainer.innerHTML += `

        <div class="card"

        style="${full ? 'opacity:.5;' : 'cursor:pointer;'}"

        onclick="${full ? '' : `openRoom('${room.id}')`}">

            <div class="card-title">

                <div>

                    <h2>${room.name}</h2>

                    <p>

                        ${booked} / ${room.capacity} أفراد

                    </p>

                </div>

                <span class="badge ${full ? "red" : "green"}">

                    ${full ? "ممتلئة" : "متاحة"}

                </span>

            </div>

            <div class="progress">

                <div style="width:${percent}%"></div>

            </div>

        </div>

        `;

    });

}

// ======================================

function openRoom(id) {

    localStorage.setItem("selectedRoom", id);

    window.location.href = "room-details.html";

}

window.openRoom = openRoom;
