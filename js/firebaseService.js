// =========================================
// Firestore Service
// طبقة موحدة للتعامل مع الأوتوبيسات والغرف
// =========================================

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
    onSnapshot
} from "./firebase.js";

const busesCol = collection(db, "buses");
const roomsCol = collection(db, "rooms");

// =========================================
// Buses
// =========================================

function watchBuses(callback) {

    return onSnapshot(busesCol, (snapshot) => {

        const buses = snapshot.docs.map(d => ({
            id: d.id,
            ...d.data()
        }));

        callback(buses);

    });

}

async function getAllBuses() {

    const snapshot = await getDocs(busesCol);

    return snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
    }));

}

async function getBusById(id) {

    const snap = await getDoc(doc(db, "buses", id));

    if (!snap.exists()) return null;

    return { id: snap.id, ...snap.data() };

}

async function addBusToDB(name, capacity) {

    return addDoc(busesCol, {
        name,
        capacity,
        passengers: []
    });

}

async function deleteBusFromDB(id) {

    return deleteDoc(doc(db, "buses", id));

}

async function updateBusPassengers(id, passengers) {

    return updateDoc(doc(db, "buses", id), { passengers });

}

// =========================================
// Rooms
// =========================================

function watchRooms(callback) {

    return onSnapshot(roomsCol, (snapshot) => {

        const rooms = snapshot.docs.map(d => ({
            id: d.id,
            ...d.data()
        }));

        callback(rooms);

    });

}

function watchRoomsByGender(gender, callback) {

    const q = query(roomsCol, where("gender", "==", gender));

    return onSnapshot(q, (snapshot) => {

        const rooms = snapshot.docs.map(d => ({
            id: d.id,
            ...d.data()
        }));

        callback(rooms);

    });

}

async function getAllRooms() {

    const snapshot = await getDocs(roomsCol);

    return snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
    }));

}

async function getRoomById(id) {

    const snap = await getDoc(doc(db, "rooms", id));

    if (!snap.exists()) return null;

    return { id: snap.id, ...snap.data() };

}

async function addRoomToDB(name, gender, capacity) {

    return addDoc(roomsCol, {
        name,
        gender,
        capacity,
        occupants: [],
        notes: "",
        locked: false
    });

}

async function deleteRoomFromDB(id) {

    return deleteDoc(doc(db, "rooms", id));

}

async function updateRoomData(id, data) {

    return updateDoc(doc(db, "rooms", id), data);

}

export {
    watchBuses,
    getAllBuses,
    getBusById,
    addBusToDB,
    deleteBusFromDB,
    updateBusPassengers,
    watchRooms,
    watchRoomsByGender,
    getAllRooms,
    getRoomById,
    addRoomToDB,
    deleteRoomFromDB,
    updateRoomData
};
