document.addEventListener("DOMContentLoaded", () => {
  const endpoint = "http://localhost:3000/api/door/log-aktivitas"; // ganti sesuai backend lu
  const logTableBody = document.getElementById("logTableBody");

  // Fungsi untuk ambil data dan render ke tabel
  async function fetchAndRenderLogs() {
    try {
      const response = await fetch(endpoint);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      logTableBody.innerHTML = ""; // Clear isi tabel

      data.forEach((log, index) => {
        const createdAt = new Date(log.created_at);
        const tanggal = createdAt.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        const jam = createdAt.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        const row = `
          <tr class="hover:bg-gray-50">
            <td class="p-4 text-center">${index + 1}</td>
            <td class="p-4 text-center">${log.kartu_id}</td>
            <td class="p-4 text-center">${log.pengguna}</td>
            <td class="p-4 text-center">${tanggal}</td>
            <td class="p-4 text-center">${jam}</td>
          </tr>
        `;
        logTableBody.insertAdjacentHTML("beforeend", row);
      });
    } catch (error) {
      console.error("Gagal ambil data log aktivitas:", error.message);
      logTableBody.innerHTML = `
        <tr>
          <td colspan="5" class="p-4 text-center text-red-500">Gagal memuat data</td>
        </tr>
      `;
    }
  }

  fetchAndRenderLogs(); // panggil saat halaman siap
});
