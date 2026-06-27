// ======================================
// Room Type (List rooms by gender)
// ======================================

import { watchRoomsByGender } from "./firebaseService.js";

const gender = localStorage.getItem("roomGender");

const pageTitle = document.getElementById("pageTitle");

const roomsContainer = document.getElementById("roomsContainer");

let rooms = [];

// ======================================

pageTitle.innerHTML =
    gender == "male"
        ? "غرف الولاد"
        : "غرف البنات";

roomsContainer.innerHTML = `<p style="text-align:center;">جاري التحميل...</p>`;

// ======================================
// Live Listener
// ======================================

watchRoomsByGender(gender, (data) => {

    rooms = data;

    renderRooms();

});

// ======================================

function renderRooms() {

    roomsContainer.innerHTML = "";

    if (rooms.length === 0) {

        roomsContainer.innerHTML = `<div class="card"><p style="text-align:center;">لا توجد غرف متاحة حالياً</p></div>`;

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
