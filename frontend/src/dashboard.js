// Logout: hapus token/localStorage lalu redirect
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token"); // opsional, tergantung metode login lo
  window.location.href = "./login.html";
});

document.addEventListener("DOMContentLoaded", () => {
  fetchDoorStatus();
});

function fetchDoorStatus() {
  fetch("http://localhost:3000/api/door/status")
    .then((response) => response.json())
    .then((data) => {
      const statusPintuEl = document.getElementById("statusPintu");
      const waktuEl = document.getElementById("doorTime");
      const aksesHariIniEl = document.getElementById("aksesHariIni");

      // Format waktu
      if (data.status_pintu && data.waktu_akses) {
        const waktu = new Date(data.waktu_akses);
        const waktuFormatted = waktu.toLocaleString("id-ID", {
          dateStyle: "medium",
          timeStyle: "short",
        });

        statusPintuEl.textContent = data.status_pintu;
        waktuEl.textContent = waktuFormatted;
      } else {
        statusPintuEl.textContent = "Tidak Diketahui";
        waktuEl.textContent = "---";
      }

      aksesHariIniEl.textContent = data.total_akses_hari_ini || 0;
    })
    .catch((error) => {
      console.error("Gagal ambil status pintu:", error);
      document.getElementById("statusPintu").textContent = "Error";
      document.getElementById("doorTime").textContent = "Gagal ambil data";
      document.getElementById("aksesHariIni").textContent = "Error";
    });
}