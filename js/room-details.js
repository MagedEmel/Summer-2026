// ========================================
// Room Details
// ========================================

import {
    getRoomById,
    getAllRooms,
    updateRoomData
} from "./firebaseService.js";

const roomId = localStorage.getItem("selectedRoom");

const roomTitle = document.getElementById("roomTitle");
const membersContainer = document.getElementById("membersContainer");
const remainingInfo = document.getElementById("remainingInfo");
const roomNotes = document.getElementById("roomNotes");
const addPersonBtn = document.getElementById("addPersonBtn");

let room = null;
let remaining = 0; // عدد الأماكن المتاحة فعلياً في الغرفة

// ========================================
// Load
// ========================================

(async function init() {

    if (!roomId) {

        window.location.href = "room-type.html";

        return;

    }

    room = await getRoomById(roomId);

    if (!room) {

        showToast("الغرفة غير موجودة", "#d94343");

        setTimeout(() => window.location.href = "room-type.html", 1200);

        return;

    }

    remaining = room.capacity - room.occupants.length;

    if (remaining <= 0) {

        roomTitle.innerHTML = room.name + " (الغرفة ممتلئة)";

        membersContainer.innerHTML = `<p style="text-align:center;color:#d94343;">عذراً، هذه الغرفة اكتمل عدد أفرادها.</p>`;

        addPersonBtn.style.display = "none";

        document.querySelector('button[onclick="saveRoom()"]').style.display = "none";

        return;

    }

    roomTitle.innerHTML = room.name;

    updateRemainingInfo();

    addPersonInput();

})();

// ========================================
// Remaining Info
// ========================================

function updateRemainingInfo() {

    const used = document.querySelectorAll(".memberInput").length;

    const left = remaining - used;

    remainingInfo.innerHTML =
        `المتاح في الغرفة: ${remaining} | لسه تقدر تضيف: ${left >= 0 ? left : 0}`;

    addPersonBtn.style.display = used >= remaining ? "none" : "block";

}

// ========================================
// Add Person Input
// ========================================

function addPersonInput() {

    const used = document.querySelectorAll(".memberInput").length;

    if (used >= remaining) return;

    const index = used + 1;

    const row = document.createElement("div");

    row.className = "personRow";

    row.style.marginBottom = "15px";

    row.style.display = "flex";

    row.style.gap = "8px";

    row.innerHTML = `

        <div style="flex:1;">

            <label>الفرد ${index}</label>

            <input type="text" class="memberInput" placeholder="الاسم بالكامل">

        </div>

        ${index > 1 ? `<button type="button" class="btn-red" style="width:auto;align-self:flex-end;height:48px;" onclick="removePersonInput(this)">حذف</button>` : ""}

    `;

    membersContainer.appendChild(row);

    updateRemainingInfo();

}

window.addPersonInput = addPersonInput;

// ========================================
// Remove Person Input
// ========================================

function removePersonInput(btn) {

    btn.closest(".personRow")?.remove();

    // إعادة ترقيم الخانات

    const rows = membersContainer.querySelectorAll(".memberInput");

    rows.forEach((input, i) => {

        input.previousElementSibling.innerHTML = `الفرد ${i + 1}`;

    });

    updateRemainingInfo();

}

window.removePersonInput = removePersonInput;

// ========================================
// Save Room
// ========================================

async function saveRoom() {

    if (!room) return;

    const inputs = document.querySelectorAll(".memberInput");

    let names = [];

    // التحقق من الخانات (تجاهل الخانات الفاضية، بس لازم اسم واحد على الأقل)

    for (let input of inputs) {

        const name = input.value.trim();

        if (name !== "") {

            names.push(name);

        }

    }

    if (names.length === 0) {

        showToast("من فضلك اكتب اسم واحد على الأقل", "#d94343");

        return;

    }

    if (names.length > remaining) {

        showToast("عدد الأسماء أكبر من الأماكن المتاحة بالغرفة", "#d94343");

        return;

    }

    // ====================================
    // تكرار داخل نفس الطلب
    // ====================================

    const unique = [...new Set(names)];

    if (unique.length != names.length) {

        showToast("لا يمكن تكرار نفس الاسم", "#d94343");

        return;

    }

    // ====================================
    // تحميل أحدث بيانات قبل الحفظ
    // ====================================

    const allRooms = await getAllRooms();

    // موجود في غرفة (بما فيها نفس الغرفة - لمنع تكرار اسم محجوز فعلاً)

    for (let r of allRooms) {

        if (r.occupants.some(x => names.includes(x))) {

            showToast("يوجد اسم محجوز بغرفة بالفعل", "#d94343");

            return;

        }

    }

    // ====================================
    // التأكد إن الغرفة لسه فيها مكان (لو حصل حجز من جهاز تاني في نفس الوقت)
    // ====================================

    const freshRoom = allRooms.find(r => r.id === room.id);

    const freshRemaining = freshRoom.capacity - freshRoom.occupants.length;

    if (names.length > freshRemaining) {

        showToast("الأماكن المتاحة تغيرت، حاول مرة أخرى", "#d94343");

        setTimeout(() => location.reload(), 1200);

        return;

    }

    // ====================================
    // Save (إضافة الأسماء الجديدة على المتواجدين بالفعل)
    // ====================================

    const updatedOccupants = [...freshRoom.occupants, ...names];

    let updatedNotes = freshRoom.notes || "";

    if (roomNotes.value.trim() !== "") {

        updatedNotes = updatedNotes
            ? updatedNotes + " | " + roomNotes.value.trim()
            : roomNotes.value.trim();

    }

    try {

        await updateRoomData(room.id, {
            occupants: updatedOccupants,
            notes: updatedNotes
        });

        showToast("تم حفظ الغرفة بنجاح ✅");

        setTimeout(() => {

            window.location.href = "room-type.html";

        }, 1200);

    }

    catch (e) {

        console.log(e);

        showToast("حدث خطأ، حاول مرة أخرى", "#d94343");

    }

}

window.saveRoom = saveRoom;
