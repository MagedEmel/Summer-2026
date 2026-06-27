// ==========================================
// Rooms
// ==========================================

function openRooms(gender) {

    // حفظ نوع الغرف المختار
    localStorage.setItem("roomGender", gender);

    // الانتقال لصفحة الغرف
    window.location.href = "room-type.html";

}