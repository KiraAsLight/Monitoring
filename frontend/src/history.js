document.addEventListener("DOMContentLoaded", () => {
  const historyTableBody = document.getElementById("historyTableBody");

  // Fungsi untuk ambil semua data history
  async function fetchAllHistory() {
    const endpoint = "http://localhost:3000/api/door/log-aktivitas";

    try {
      const response = await fetch(endpoint);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      renderHistoryToTable(data);
    } catch (error) {
      console.error("Gagal ambil data history:", error.message);
      showErrorMessage("Gagal memuat data history");
    }
  }

  // Fungsi untuk render data ke tabel history
  function renderHistoryToTable(data) {
    historyTableBody.innerHTML = ""; // Clear isi tabel

    if (data.length === 0) {
      historyTableBody.innerHTML = `
        <tr>
          <td colspan="6" class="p-4 text-center text-gray-500">Tidak ada data history ditemukan</td>
        </tr>
      `;
      return;
    }

    data.forEach((history, index) => {
      // Format waktu
      const createdAt = new Date(history.created_at);
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

      // Ambil keterangan dari database
      const keterangan = history.keterangan || "Akses Tidak Diketahui";

      // Gunakan field `status` untuk badge (lebih akurat)
      const status = history.status?.toLowerCase() || "pending";

      // Tentukan warna badge berdasarkan `status` (enum)
      let badgeClass = "bg-gray-100 text-gray-800"; // default
      if (status === "berhasil" || status === "success") {
        badgeClass = "bg-green-100 text-green-800";
      } else if (status === "gagal" || status === "failed") {
        badgeClass = "bg-red-100 text-red-800";
      } else if (status === "pending") {
        badgeClass = "bg-yellow-100 text-yellow-800";
      }

      const row = `
      <tr class="hover:bg-gray-50">
        <td class="p-4 text-center">${index + 1}</td>
        <td class="p-4">${history.kartu_id || "N/A"}</td>
        <td class="p-4">${history.pengguna || "N/A"}</td>
        <td class="p-4">${tanggal}</td>
        <td class="p-4">${jam}</td>
        <td class="p-4">
          <span class="inline-block px-2 py-1 text-xs font-medium ${badgeClass} rounded-full">
            ${keterangan}
          </span>
        </td>
      </tr>
    `;
      historyTableBody.insertAdjacentHTML("beforeend", row);
    });
  }

  // Fungsi untuk menampilkan pesan error
  function showErrorMessage(message) {
    historyTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="p-4 text-center text-red-500">${message}</td>
      </tr>
    `;
  }

  // Fungsi untuk ambil data berdasarkan filter tanggal
  async function fetchFilteredHistory(startDate, endDate) {
    const endpoint = `http://localhost:3000/api/door/history?mulai=${startDate}&sampai=${endDate}`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      renderHistoryToTable(data);
    } catch (error) {
      console.error("Gagal ambil data history terfilter:", error.message);
      showErrorMessage("Gagal memuat data filter");
    }
  }

  // Event listener untuk form filter (jika ada)
  const filterForm = document.getElementById("filterForm");
  if (filterForm) {
    filterForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const startDate = document.getElementById("startDate").value;
      const endDate = document.getElementById("endDate").value;

      if (!startDate || !endDate) {
        alert("Silakan pilih tanggal mulai dan tanggal akhir!");
        return;
      }

      if (startDate > endDate) {
        alert("Tanggal mulai tidak boleh lebih besar dari tanggal akhir!");
        return;
      }

      await fetchFilteredHistory(startDate, endDate);
    });

    // Event listener untuk reset button
    const resetBtn = document.getElementById("resetBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        document.getElementById("startDate").value = "";
        document.getElementById("endDate").value = "";
        fetchAllHistory();
      });
    }
  }

  // Event listener untuk logout button
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "./login.html";
  });

  // Load semua data saat halaman pertama kali dibuka
  fetchAllHistory();
});
