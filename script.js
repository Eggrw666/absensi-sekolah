document.addEventListener("DOMContentLoaded", function () {
    const absensiForm = document.getElementById("absensiForm");
    const absensiTable = document.querySelector("#absensiTable tbody");

    // Load data dari LocalStorage
    let absensiData = JSON.parse(localStorage.getItem("absensiData")) || [];

    // Fungsi untuk menyimpan data ke LocalStorage
    function saveToLocalStorage() {
        localStorage.setItem("absensiData", JSON.stringify(absensiData));
    }

    // Fungsi untuk menampilkan data ke tabel
    function renderTable() {
        absensiTable.innerHTML = "";
        absensiData.forEach((data, index) => {
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${data.nama}</td>
                    <td>${data.kelas}</td>
                    <td>${data.status}</td>
                    <td><button class="delete" data-index="${index}">Hapus</button></td>
                </tr>
            `;
            absensiTable.innerHTML += row;
        });
    }

    // Tambahkan data ke absensi
    absensiForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const nama = document.getElementById("nama").value;
        const kelas = document.getElementById("kelas").value;
        const status = document.getElementById("status").value;

        absensiData.push({ nama, kelas, status });
        saveToLocalStorage();
        renderTable();

        // Reset form
        absensiForm.reset();
    });

    // Hapus data
    absensiTable.addEventListener("click", function (e) {
        if (e.target.classList.contains("delete")) {
            const index = e.target.getAttribute("data-index");
            absensiData.splice(index, 1);
            saveToLocalStorage();
            renderTable();
        }
    });

    // Render tabel saat pertama kali
    renderTable();
});
