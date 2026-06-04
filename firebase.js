import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCe2wsBsCKyCpbWsHbmW5Cl9tsXVmq0YoA",
  authDomain: "absensikelas-2e9af.firebaseapp.com",
  projectId: "absensikelas-2e9af",
  storageBucket: "absensikelas-2e9af.firebasestorage.app",
  messagingSenderId: "275987900358",
  appId: "1:275987900358:web:6d8fd611dae521ef14b4c7",
  measurementId: "G-N023MJZNV1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

window.db = db;

export async function getAbsensiFirebase() {

    const snapshot = await getDocs(
        collection(db, "absensi")
    );

    let data = [];

    snapshot.forEach(docSnap => {
        data.push({
            id: docSnap.id,
            ...docSnap.data()
        });
    });

    return data;
}

window.getAbsensiFirebase = getAbsensiFirebase;

window.collection = collection;
window.addDoc = addDoc;
window.getDocs = getDocs;
window.deleteDoc = deleteDoc;
window.doc = doc;