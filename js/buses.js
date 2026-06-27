// ==========================================
// Buses
// ==========================================

import { watchBuses } from "./firebaseService.js";

let buses = [];

const container = document.getElementById("busContainer");

container.innerHTML = `<p style="text-align:center;">جاري التحميل...</p>`;

// ==========================================
// Live Listener
// ==========================================

watchBuses((data) => {

    buses = data;

    renderBuses();

});

// ==========================================
// Render
// ==========================================

function renderBuses() {

    container.innerHTML = "";

    if (buses.length === 0) {

        container.innerHTML = `<div class="card"><p style="text-align:center;">لا توجد أوتوبيسات متاحة حالياً</p></div>`;

        return;

    }

    buses.forEach(bus => {

        const booked = bus.passengers.length;

        const full = booked >= bus.capacity;

        const percent = (booked / bus.capacity) * 100;

        container.innerHTML += `

        <div class="card bus-card ${full ? "disabled" : ""}"
            onclick="${full ? "" : `openBus('${bus.id}')`}">

            <div class="card-title">

                <div>

                    <h2>${bus.name}</h2>

                    <p>${booked} / ${bus.capacity} مقعد</p>

                </div>

                <span class="badge ${full ? "red" : "green"}">

                    ${full ? "ممتلئ" : "متاح"}

                </span>

            </div>

            <div class="progress">

                <div style="width:${percent}%"></div>

            </div>

        </div>

        `;

    });

}

// ==========================================
// Open Bus
// ==========================================

function openBus(id) {

    localStorage.setItem("selectedBus", id);

    window.location.href = "bus-details.html";

}

window.openBus = openBus;
