const db = require("../config/db");

// Ambil semua log aktivitas dengan debug
exports.getLogActivity = async (req, res) => {
  // // Pertama, cek struktur tabel
  // try {
  //   const [columns] = await db.execute("DESCRIBE log_aktivitas");
  //   console.log(
  //     "Struktur tabel log_aktivitas:",
  //     columns.map((col) => col.Field)
  //   );
  // } catch (err) {
  //   console.error("Error cek struktur tabel:", err);
  // }

  // Query dengan SELECT *untuk melihat semua kolom
  const sql = `SELECT * FROM log_aktivitas ORDER BY created_at DESC LIMIT 5`;

  try {
    const [rows] = await db.execute(sql);
    // console.log("Sample data dari database:", JSON.stringify(rows, null, 2));

    // Kirim semua data untuk debugging
    res.status(200).json(rows);
  } catch (err) {
    // console.error("Error mengambil data log:", err);
    res.status(500).json({
      message: "Gagal mengambil data log",
      error: err.message,
    });
  }
};

// Ambil history berdasarkan rentang tanggal
exports.getHistory = async (req, res) => {
  const { mulai, sampai } = req.query;

  if (!mulai || !sampai) {
    return res.status(400).json({ error: "Rentang tanggal tidak lengkap" });
  }

  try {
    const [rows] = await db.execute(
      "SELECT * FROM log_aktivitas WHERE DATE(created_at) BETWEEN ? AND ? ORDER BY created_at DESC",
      [mulai, sampai]
    );
    // console.log("History data:", JSON.stringify(rows, null, 2));
    res.json(rows);
  } catch (err) {
    // console.error("Error ambil history:", err);
    res.status(500).json({ error: "Gagal ambil data history" });
  }
};

// const db = require("../config/db");

// // Ambil semua log aktivitas
// exports.getLogActivity = async (req, res) => {
//   const sql = `SELECT kartu_id, pengguna, created_at, status, keterangan FROM log_aktivitas ORDER BY created_at DESC`;

//   try {
//     const [rows] = await db.execute(sql);
//     res.status(200).json(rows);
//   } catch (err) {
//     console.error("Error mengambil data log:", err);
//     res.status(500).json({
//       message: "Gagal mengambil data log",
//       error: err.message,
//     });
//   }
// };

// // Ambil history berdasarkan rentang tanggal
// exports.getHistory = async (req, res) => {
//   const { mulai, sampai } = req.query;

//   if (!mulai || !sampai) {
//     return res.status(400).json({ error: "Rentang tanggal tidak lengkap" });
//   }

//   try {
//     const [rows] = await db.execute(
//       "SELECT * FROM log_aktivitas WHERE DATE(created_at) BETWEEN ? AND ? ORDER BY created_at DESC",
//       [mulai, sampai]
//     );
//     res.json(rows);
//   } catch (err) {
//     console.error("Error ambil history:", err);
//     res.status(500).json({ error: "Gagal ambil data history" });
//   }
// };
