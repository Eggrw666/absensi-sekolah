document.addEventListener("DOMContentLoaded", function () {
    const loginContainer = document.getElementById("loginContainer");
    const dashboardContainer = document.getElementById("dashboardContainer");
    const loginForm = document.getElementById("loginForm");
    const absensiForm = document.getElementById("absensiForm");
    const addAccountForm = document.getElementById("addAccountForm");
    const absensiTable = document.querySelector("#absensiTable tbody");
    const accountsTable = document.querySelector("#accountsTable tbody");
    const adminFeatures = document.getElementById("adminFeatures");
    const adminActionsHeader = document.getElementById("adminActionsHeader");
    const logoutButton = document.getElementById("logoutButton");

    // Data Dummy Admin
    const adminUser = { username: "admin", password: "admin123", role: "admin" };

    // Data Absensi
    let absensiData = JSON.parse(localStorage.getItem("absensiData")) || [];
    // Data Akun Siswa
    let accountsData = JSON.parse(localStorage.getItem("accountsData")) || [];

    // Fungsi untuk menyimpan data absensi ke LocalStorage
    function saveAbsensiToLocalStorage() {
        localStorage.setItem("absensiData", JSON.stringify(absensiData));
    }

    // Fungsi untuk menyimpan akun siswa ke LocalStorage
    function saveAccountsToLocalStorage() {
        localStorage.setItem("accountsData", JSON.stringify(accountsData));
    }

    // Fungsi untuk menampilkan tabel data absensi
    function renderAbsensiTable(currentUser) {
        absensiTable.innerHTML = "";
        absensiData.forEach((data, index) => {
            if (currentUser.role === "admin" || data.nama.toLowerCase() === currentUser.username) {
                const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${data.tanggal}</td>
                        <td>${data.nama}</td>
                        <td>${data.kelas}</td>
                        <td>${data.status}</td>
                        ${
                            currentUser.role === "admin"
                                ? `<td><button class="delete" data-index="${index}">Hapus</button></td>`
                                : ""
                        }
                    </tr>
                `;
                absensiTable.innerHTML += row;
            }
        });
    }

    // Fungsi untuk menampilkan tabel data akun siswa
    function renderAccountsTable() {
        accountsTable.innerHTML = "";
        accountsData.forEach((account, index) => {
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${account.username}</td>
                    <td><button class="deleteAccount" data-index="${index}">Hapus</button></td>
                </tr>
            `;
            accountsTable.innerHTML += row;
        });
    }

    // Fungsi untuk login
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const username = document.getElementById("username").value.trim().toLowerCase();
        const password = document.getElementById("password").value;

        // Gabungkan admin dan akun siswa
        const allUsers = [adminUser, ...accountsData];

        // Cari pengguna
        const user = allUsers.find(u => u.username === username && u.password === password);

        if (user) {
            localStorage.setItem("currentUser", JSON.stringify(user));
            loginContainer.style.display = "none";
            dashboardContainer.style.display = "block";

            if (user.role === "admin") {
                adminFeatures.style.display = "block";
                adminActionsHeader.style.display = "table-cell";
                renderAccountsTable();
            } else {
                adminFeatures.style.display = "none";
                adminActionsHeader.style.display = "none";
            }

            renderAbsensiTable(user);
        } else {
            alert("Username atau password salah!");
        }
    });

    // Fungsi untuk logout
    logoutButton.addEventListener("click", function () {
        localStorage.removeItem("currentUser");
        loginContainer.style.display = "block";
        dashboardContainer.style.display = "none";
    });

    // Tambah data absensi (khusus admin)
    absensiForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const tanggal = document.getElementById("tanggal").value;
        const nama = document.getElementById("nama").value.trim().toLowerCase();
        const kelas = document.getElementById("kelas").value.trim();
        const status = document.getElementById("status").value;

        absensiData.push({ tanggal, nama, kelas, status });
        saveAbsensiToLocalStorage();
        renderAbsensiTable({ role: "admin" });
        absensiForm.reset();
        alert("Data absensi berhasil ditambahkan!");
    });

    // Tambah akun siswa (khusus admin)
    addAccountForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const newUsername = document.getElementById("newUsername").value.trim().toLowerCase();
        const newPassword = document.getElementById("newPassword").value;

        if (accountsData.some(account => account.username === newUsername)) {
            alert("Username sudah digunakan!");
            return;
        }

        accountsData.push({ username: newUsername, password: newPassword, role: "siswa" });
        saveAccountsToLocalStorage();
        renderAccountsTable();
        addAccountForm.reset();
        alert("Akun siswa berhasil ditambahkan!");
    });

    // Hapus akun siswa
    accountsTable.addEventListener("click", function (e) {
        if (e.target.classList.contains("deleteAccount")) {
            const index = e.target.getAttribute("data-index");
            accountsData.splice(index, 1);
            saveAccountsToLocalStorage();
            renderAccountsTable();
            alert("Akun siswa berhasil dihapus!");
        }
    });

    // Hapus data absensi
    absensiTable.addEventListener("click", function (e) {
        if (e.target.classList.contains("delete")) {
            const index = e.target.getAttribute("data-index");
            absensiData.splice(index, 1);
            saveAbsensiToLocalStorage();
            renderAbsensiTable({ role: "admin" });
            alert("Data absensi berhasil dihapus!");
        }
    });

    // Render tabel absensi saat halaman dimuat
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
        loginContainer.style.display = "none";
        dashboardContainer.style.display = "block";

        if (currentUser.role === "admin") {
            adminFeatures.style.display = "block";
            adminActionsHeader.style.display = "table-cell";
            renderAccountsTable();
        }

        renderAbsensiTable(currentUser);
    } else {
        loginContainer.style.display = "block";
        dashboardContainer.style.display = "none";
    }
});
