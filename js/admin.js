import {
    watchBuses,
    watchRooms,
    addBusToDB,
    deleteBusFromDB,
    addRoomToDB,
    deleteRoomFromDB,
    updateRoomData
} from "./firebaseService.js";

// =========================================
// Admin Panel
// =========================================

// حماية الصفحة

if (localStorage.getItem("adminLogged") != "true") {

    window.location.href = "admin-login.html";

}

// =========================================

let buses = [];
let rooms = [];

// =========================================
// Live Listeners
// =========================================

watchBuses((data) => {

    buses = data;

    updateStatistics();
    renderBusList();

});

watchRooms((data) => {

    rooms = data;

    updateStatistics();
    renderRoomList();

});

// =========================================
// Statistics
// =========================================

function updateStatistics() {

    document.getElementById("busCount").innerHTML =
        buses.length;

    let passengerCount = 0;

    buses.forEach(bus => {

        passengerCount += bus.passengers.length;

    });

    document.getElementById("passengerCount").innerHTML =
        passengerCount;

    document.getElementById("roomCount").innerHTML =
        rooms.length;

    let roomMembers = 0;

    rooms.forEach(room => {

        roomMembers += room.occupants.length;

    });

    document.getElementById("roomMembers").innerHTML =
        roomMembers;

}

// =========================================
// Search
// =========================================

function searchPerson() {

    const keyword = document
        .getElementById("searchInput")
        .value
        .trim()
        .toLowerCase();

    const result = document.getElementById("searchResult");

    result.innerHTML = "";

    if (keyword == "")
        return;

    // البحث في الأوتوبيسات

    buses.forEach(bus => {

        bus.passengers.forEach(name => {

            if (name.toLowerCase().includes(keyword)) {

                result.innerHTML += `

                <div class="card">

                    🚌 <b>${name}</b>

                    <br>

                    ${bus.name}

                </div>

                `;

            }

        });

    });

    // البحث في الغرف

    rooms.forEach(room => {

        room.occupants.forEach(name => {

            if (name.toLowerCase().includes(keyword)) {

                result.innerHTML += `

                <div class="card">

                    🛏️ <b>${name}</b>

                    <br>

                    ${room.name}

                </div>

                `;

            }

        });

    });

}

window.searchPerson = searchPerson;

// =========================================
// Logout
// =========================================

function logout() {

    localStorage.removeItem("adminLogged");

    window.location.href = "index.html";

}

window.logout = logout;

// =========================================
// Reset System
// =========================================

async function resetSystem() {

    if (!confirm("هل أنت متأكد من حذف جميع البيانات؟"))
        return;

    try {

        await Promise.all(buses.map(b => deleteBusFromDB(b.id)));
        await Promise.all(rooms.map(r => deleteRoomFromDB(r.id)));

        showToast("تم حذف جميع البيانات");

    }

    catch (e) {

        console.log(e);

        showToast("حدث خطأ أثناء الحذف", "#d94343");

    }

}

window.resetSystem = resetSystem;

// =========================================
// Add Bus
// =========================================

async function addBus() {

    const nameInput = document.getElementById("busNameInput");
    const capacityInput = document.getElementById("busCapacityInput");

    const name = nameInput.value.trim();
    const capacity = Number(capacityInput.value);

    if (!name) {

        showToast("من فضلك اكتب اسم الأوتوبيس", "#d94343");

        return;

    }

    if (!capacity || capacity <= 0) {

        showToast("عدد المقاعد غير صحيح", "#d94343");

        return;

    }

    try {

        await addBusToDB(name, capacity);

        nameInput.value = "";
        capacityInput.value = "";

        showToast("تم إضافة الأوتوبيس ✅");

    }

    catch (e) {

        console.log(e);

        showToast("حدث خطأ", "#d94343");

    }

}

window.addBus = addBus;

// =========================================
// Delete Bus
// =========================================

async function deleteBus(id) {

    if (!confirm("حذف الأوتوبيس؟"))
        return;

    try {

        await deleteBusFromDB(id);

        showToast("تم حذف الأوتوبيس");

    }

    catch (e) {

        console.log(e);

        showToast("حدث خطأ", "#d94343");

    }

}

window.deleteBus = deleteBus;

// =========================================
// Add Room
// =========================================

async function addRoom() {

    const nameInput = document.getElementById("roomNameInput");
    const capacityInput = document.getElementById("roomCapacityInput");
    const genderInput = document.getElementById("roomGenderInput");

    const name = nameInput.value.trim();
    const capacity = parseInt(capacityInput.value);
    const gender = genderInput.value;

    if (!name) {

        showToast("من فضلك اكتب اسم الغرفة", "#d94343");

        return;

    }

    if (!capacity || capacity <= 0) {

        showToast("عدد الأفراد غير صحيح", "#d94343");

        return;

    }

    try {

        await addRoomToDB(name, gender, capacity);

        nameInput.value = "";
        capacityInput.value = "";

        showToast("تمت إضافة الغرفة ✅");

    }

    catch (e) {

        console.log(e);

        showToast("حدث خطأ", "#d94343");

    }

}

window.addRoom = addRoom;

// =========================================
// Delete Room
// =========================================

async function deleteRoom(id) {

    if (!confirm("حذف الغرفة؟"))
        return;

    try {

        await deleteRoomFromDB(id);

        showToast("تم حذف الغرفة");

    }

    catch (e) {

        console.log(e);

        showToast("حدث خطأ", "#d94343");

    }

}

window.deleteRoom = deleteRoom;

// =========================================
// Unlock Room
// =========================================

async function unlockRoom(id) {

    try {

        await updateRoomData(id, {
            locked: false,
            occupants: [],
            notes: ""
        });

        showToast("تم فتح الغرفة");

    }

    catch (e) {

        console.log(e);

        showToast("حدث خطأ", "#d94343");

    }

}

window.unlockRoom = unlockRoom;

// =========================================
// Render Bus List
// =========================================

function renderBusList() {

    const container = document.getElementById("busListContainer");

    if (!container) return;

    if (buses.length === 0) {

        container.innerHTML = `<p style="text-align:center;">لا توجد أوتوبيسات</p>`;

        return;

    }

    container.innerHTML = "";

    buses.forEach(bus => {

        container.innerHTML += `

        <div class="card-title" style="margin-bottom:10px;">

            <div>
                <b>${bus.name}</b>
                <p>${bus.passengers.length} / ${bus.capacity} راكب</p>
            </div>

            <button style="width:auto" class="btn-red" onclick="deleteBus('${bus.id}')">
                حذف
            </button>

        </div>

        `;

    });

}

// =========================================
// Render Room List
// =========================================

function renderRoomList() {

    const container = document.getElementById("roomListContainer");

    if (!container) return;

    if (rooms.length === 0) {

        container.innerHTML = `<p style="text-align:center;">لا توجد غرف</p>`;

        return;

    }

    container.innerHTML = "";

    rooms.forEach(room => {

        const genderLabel = room.gender === "male" ? "ولاد" : "بنات";

        const isFull = room.occupants.length >= room.capacity;

        container.innerHTML += `

        <div class="card-title" style="margin-bottom:10px;">

            <div>
                <b>${room.name}</b>
                <p>${genderLabel} • ${room.occupants.length} / ${room.capacity} فرد ${isFull ? "• ممتلئة" : ""}</p>
            </div>

            <div>
                ${room.occupants.length > 0 ? `<button style="width:auto" class="btn-gold" onclick="unlockRoom('${room.id}')">تصفية الغرفة</button>` : ""}
                <button style="width:auto" class="btn-red" onclick="deleteRoom('${room.id}')">حذف</button>
            </div>

        </div>

        `;

    });

}

// =========================================
// Export CSV
// =========================================

function exportExcel() {

    if (typeof XLSX === "undefined") {

        showToast("تعذر تحميل مكتبة Excel، تأكد من الاتصال بالإنترنت", "#d94343");

        return;

    }

    const workbook = XLSX.utils.book_new();

    // =====================================
    // شيت الأوتوبيسات
    // كل أوتوبيس عمود، وتحته أسماء ركابه
    // =====================================

    const busHeaders = buses.map(bus =>
        `${bus.name} (${bus.passengers.length}/${bus.capacity})`
    );

    const maxBusRows = buses.reduce(
        (max, bus) => Math.max(max, bus.passengers.length),
        0
    );

    const busSheetData = [busHeaders];

    for (let i = 0; i < maxBusRows; i++) {

        const row = buses.map(bus => bus.passengers[i] || "");

        busSheetData.push(row);

    }

    const busSheet = XLSX.utils.aoa_to_sheet(busSheetData);

    busSheet["!cols"] = buses.map(() => ({ wch: 25 }));

    XLSX.utils.book_append_sheet(workbook, busSheet, "الأوتوبيسات");

    // =====================================
    // شيت الغرف
    // كل صف: رقم/اسم الغرفة، ثم الأسماء بجانبها
    // =====================================

    const maxRoomMembers = rooms.reduce(
        (max, room) => Math.max(max, room.occupants.length),
        0
    );

    const roomHeaders = [
        "اسم الغرفة",
        "النوع",
        "السعة",
        ...Array.from({ length: maxRoomMembers }, (_, i) => `فرد ${i + 1}`)
    ];

    const roomSheetData = [roomHeaders];

    rooms.forEach(room => {

        const row = [
            room.name,
            room.gender === "male" ? "ولاد" : "بنات",
            room.capacity,
            ...room.occupants
        ];

        roomSheetData.push(row);

    });

    const roomSheet = XLSX.utils.aoa_to_sheet(roomSheetData);

    roomSheet["!cols"] = roomHeaders.map(() => ({ wch: 22 }));

    XLSX.utils.book_append_sheet(workbook, roomSheet, "الغرف");

    // =====================================
    // تنزيل الملف
    // =====================================

    XLSX.writeFile(workbook, "Conference_Data.xlsx");

}

window.exportExcel = exportExcel;
