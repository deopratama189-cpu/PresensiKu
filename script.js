import {
    db,
    getAbsensiFirebase
} from "./firebase.js";

/* ==========================
   KONFIGURASI
========================== */

const PASSWORD_GURU = "guru123";
let qrValid = false;

/* ==========================
   LOGIN GURU
========================== */

async function loginGuru() {

    const password =
    document.getElementById(
        "passwordGuru"
    )?.value;

    if(password === PASSWORD_GURU){

        localStorage.setItem(
            "guruLogin",
            "true"
        );

        location.href =
        "dashboard-guru.html";

    }else{

        alert(
            "Password salah!"
        );

    }

}

/* ==========================
   LOGIN MURID
========================== */

async function loginMurid(){

    const nama =
    document.getElementById(
        "nama"
    )?.value.trim();

    const kelas =
    document.getElementById(
        "kelas"
    )?.value.trim();

    if(!nama || !kelas){

        alert(
            "Lengkapi data!"
        );

        return;

    }

    localStorage.setItem(
        "namaMurid",
        nama
    );

    localStorage.setItem(
        "kelasMurid",
        kelas
    );

    location.href =
    "dashboard-murid.html";

}


/* ==========================
   LOGOUT
========================== */

async function logout(){

    location.href =
    "index.html";

}

/* ==========================
   AMBIL DATA ABSENSI
========================== */

async function getAbsensi(){

    return await getAbsensiFirebase();

}
    
/* ==========================
   SIMPAN DATA ABSENSI
========================== */

async function simpanAbsensi(){

    const status =
    document.getElementById(
        "status"
    )?.value;

    const nama =
    localStorage.getItem(
        "namaMurid"
    );

    const kelas =
    localStorage.getItem(
        "kelasMurid"
    );

    if(
    status === "Izin"
    ||
    status === "Sakit"
){

    const alasan =
    document.getElementById(
        "alasan"
    )?.value.trim();

    const file =
    document.getElementById(
        "bukti"
    )?.files[0];

    if(!alasan){

        alert(
            "Isi alasan terlebih dahulu!"
        );

        return;

    }

    if(!file){

        alert(
            "Upload bukti terlebih dahulu!"
        );

        return;

    }

}
    if(
        status === "Hadir"
        &&
        !qrValid
    ){

        alert(
            "Scan QR terlebih dahulu!"
        );

        return;

    }

    let data = await getAbsensiFirebase();

    const sekarang =
    new Date();

    const dataBaru = {

        id: Date.now(),

        nama: nama,

        kelas: kelas,

        status: status,

        alasan:
        document.getElementById(
        "alasan"
        )?.value || "",

        tanggal:
        sekarang.toLocaleDateString(
            "id-ID"
        ),

        waktu:
        sekarang.toLocaleTimeString(
            "id-ID"
        )

    };

    await window.addDoc(
  window.collection(window.db, "absensi"),
  dataBaru
);

    alert(
        "Absensi berhasil disimpan!"
    );

    qrValid = false;

    window.location.href =
    "dashboard-murid.html";

}

/* ==========================
   GENERATE QR
========================== */

function generateQR(){

    const hariIni =
    new Date().toLocaleDateString("id-ID");

    const kodeQR =
    "ABSENSI-" + hariIni;
    
    localStorage.setItem(
        "kodeQR",
        kodeQR
    );

    const box =
    document.getElementById(
        "qrcode"
    );

    if(!box) return;

    box.innerHTML = "";

    new QRCode(
        box,
        {
            text:kodeQR,
            width:250,
            height:250
        }
    );

}

/* ==========================
   SCAN QR
========================== */

async function mulaiScanner(){

    if(
        !document.getElementById(
            "reader"
        )
    ) return;

    const scanner =
    new Html5Qrcode(
        "reader"
    );

    scanner.start(
        {
            facingMode:"environment"
        },
        {
            fps:10,
            qrbox:250
        },

       function(decodedText){

    if(
        decodedText.startsWith(
            "ABSENSI-"
        )
    ){

        qrValid = true;

        alert(
            "QR Valid"
        );

        scanner.stop();

    }else{

        alert(
            "QR Tidak Valid"
        );

    }

}

            }

        }

    );

}

function(decodedText){

    alert(decodedText);

}

/* ==========================
   DATA KEHADIRAN GURU
========================== */

async function tampilkanDataKehadiran(){

    const tbody =
    document.getElementById(
        "tbodyAbsensi"
    );

    if(!tbody) return;

    let data = await getAbsensiFirebase();

    const filter =
    document.getElementById(
        "filterKelas"
    )?.value || "";

    if(filter){

        data =
        data.filter(
            item =>
            item.kelas === filter
        );

    }

    data.sort((a,b)=>{

        if(a.kelas < b.kelas)
            return -1;

        if(a.kelas > b.kelas)
            return 1;

        return a.nama.localeCompare(
            b.nama,
            "id"
        );

    });

    tbody.innerHTML = "";

    data.forEach(item=>{

        tbody.innerHTML += `
        <tr>
            <td>${item.nama}</td>
            <td>${item.kelas}</td>
            <td>${item.status}</td>
            <td>${item.tanggal}</td>
            <td>${item.waktu}</td>
        </tr>
        `;

    });

}

/* ==========================
   FILTER KELAS
========================== */

async function isiFilterKelas(){

    const select =
    document.getElementById(
        "filterKelas"
    );

    if(!select) return;

    let data =
    await getAbsensiFirebase();

    let kelasUnik =
    [...new Set(
        data.map(
            item =>
            item.kelas
        )
    )];

    kelasUnik.sort();

    kelasUnik.forEach(kelas=>{

        select.innerHTML +=
        `<option value="${kelas}">
            ${kelas}
        </option>`;

    });

}

/* ==========================
   STATISTIK
========================== */

async function tampilkanStatistik(){

    const data = await getAbsensiFirebase();

    const hadir =
    data.filter(
        d =>
        d.status==="Hadir"
    ).length;

    const izin =
    data.filter(
        d =>
        d.status==="Izin"
    ).length;

    const sakit =
    data.filter(
        d =>
        d.status==="Sakit"
    ).length;

    if(
        document.getElementById(
            "jumlahHadir"
        )
    ){

        document.getElementById(
            "jumlahHadir"
        ).textContent = hadir;

        document.getElementById(
            "jumlahIzin"
        ).textContent = izin;

        document.getElementById(
            "jumlahSakit"
        ).textContent = sakit;

    }

}

/* ==========================
   RIWAYAT MURID
========================== */

async function tampilkanRiwayat(){

    const nama =
    localStorage.getItem(
        "namaMurid"
    );

    const kelas =
    localStorage.getItem(
        "kelasMurid"
    );

    if(!nama) return;

    const data = await getAbsensiFirebase();

    const saya =
    data.filter(item =>

        item.nama
        .trim()
        .toLowerCase()

        ===

        nama
        .trim()
        .toLowerCase()

        &&

        item.kelas === kelas

    );

    const hadir =
    saya.filter(
        d =>
        d.status==="Hadir"
    ).length;

    const izin =
    saya.filter(
        d =>
        d.status==="Izin"
    ).length;

    const sakit =
    saya.filter(
        d =>
        d.status==="Sakit"
    ).length;

    const total =
    saya.length;

    const persen =
    total > 0
    ?
    (
        hadir /
        total
    ) * 100
    :
    0;

    if(
        document.getElementById(
            "riwayatHadir"
        )
    ){

        document.getElementById(
            "riwayatHadir"
        ).textContent = hadir;

        document.getElementById(
            "riwayatIzin"
        ).textContent = izin;

        document.getElementById(
            "riwayatSakit"
        ).textContent = sakit;

        document.getElementById(
            "riwayatTotal"
        ).textContent = total;

        document.getElementById(
            "persentase"
        ).textContent =
        persen.toFixed(1)
        + "%";

    }

}

/* ==========================
   EXPORT CSV
========================== */

async function exportExcel(){

    let data = await getAbsensiFirebase();

    const kelasDipilih =
    document.getElementById(
        "KelasExport"
    )?.value || "";

    if(kelasDipilih){

        data = data.filter(
            item =>
            item.kelas === kelasDipilih
        );

    }

    if(data.length === 0){

        alert(
            "Belum ada data absensi!"
        );

        return;

    }

    let rekap = {};

    data.forEach(item=>{

        const key =
        item.nama + "|" + item.kelas;

        if(!rekap[key]){

            rekap[key] = {

                Nama:item.nama,
                Kelas:item.kelas,
                Hadir:0,
                Izin:0,
                Sakit:0

            };

        }

        if(item.status === "Hadir")
            rekap[key].Hadir++;

        if(item.status === "Izin")
            rekap[key].Izin++;

        if(item.status === "Sakit")
            rekap[key].Sakit++;

    });

    let hasil =
    Object.values(rekap);

    hasil.forEach(item=>{

        const total =
        item.Hadir +
        item.Izin +
        item.Sakit;

        item.Total = total;

        item.Persentase =
        total > 0
        ?
        (
            item.Hadir /
            total * 100
        ).toFixed(2) + "%"
        :
        "0%";

    });

    hasil.sort((a,b)=>{

        if(a.Kelas < b.Kelas)
            return -1;

        if(a.Kelas > b.Kelas)
            return 1;

        return a.Nama.localeCompare(
            b.Nama,
            "id"
        );

    });

    const worksheet =
    XLSX.utils.json_to_sheet(
        hasil
    );

    const workbook =
    XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Absensi"
    );

    XLSX.writeFile(
        workbook,
        kelasDipilih
        ?
        `rekap_${kelasDipilih}.xlsx`
        :
        "rekap_semua_kelas.xlsx"
    );

}

/* ==========================
   ISI KELAS EXPORT
========================== */
async function isiKelasExport(){

    const select =
    document.getElementById(
        "kelasExport"
    );

    if(!select) return;

    select.innerHTML =
    `
    <option value="">
        Semua Kelas
    </option>
    `;

    const data = await getAbsensiFirebase();

    const kelasUnik =
    [...new Set(
        data.map(
            item =>
            item.kelas
        )
    )];

    kelasUnik.sort();

    kelasUnik.forEach(
        kelas=>{

            select.innerHTML +=
            `
            <option value="${kelas}">
                ${kelas}
            </option>
            `;

        }
    );

}

/* ==========================
   RESET DATA
========================== */
function resetData(){

    if(
        !confirm(
            "Yakin ingin menghapus data absensi hari ini?"
        )
    ) return;

    localStorage.removeItem(
        "absensiHariIni"
    );

    alert(
        "Data absensi Hari Ini berhasil dihapus!"
    );

    location.reload();

}

/* ==========================
   AUTO LOAD
========================== */

document.addEventListener(
    "DOMContentLoaded",
    ()=>{

        tampilkanDataKehadiran();

        isiFilterKelas();

        isiKelasExport();

        tampilkanStatistik();

        tampilkanRiwayat();

    }
);

/* ==========================
    CEK STATUS
========================== */

function cekStatus(){

    const status =
    document.getElementById(
        "status"
    ).value;

    const form =
    document.getElementById(
        "formKeterangan"
    );

    const label =
    document.getElementById(
        "labelBukti"
    );

    const btnScan =
    document.getElementById(
        "btnScan"
    );

    const reader =
    document.getElementById(
        "reader"
    );

    if(status === "Izin"){

        form.style.display =
        "block";

        btnScan.style.display =
        "none";

        reader.style.display =
        "none";

        label.textContent =
        "Upload Bukti Izin";

    }
    else if(
        status === "Sakit"
    ){

        form.style.display =
        "block";

        btnScan.style.display =
        "none";

        reader.style.display =
        "none";

        label.textContent =
        "Upload Surat Dokter";

    }
    else{

        form.style.display =
        "none";

        btnScan.style.display =
        "inline-block";

        reader.style.display =
        "block";

    }

}

window.loginGuru = loginGuru;
window.loginMurid = loginMurid;
window.mulaiScanner = mulaiScanner;
window.logout = logout;
window.simpanAbsensi = simpanAbsensi;
window.generateQR = generateQR;
window.cekStatus = cekStatus;
window.exportExcel = exportExcel;
window.resetData = resetData;
window.tampilkanDataKehadiran = tampilkanDataKehadiran;
window.tampilkanStatistik = tampilkanStatistik;
window.tampilkanRiwayat = tampilkanRiwayat;
window.isiFilterKelas = isiFilterKelas;
window.isiKelasExport = isiKelasExport;
window.getAbsensi = getAbsensi;
