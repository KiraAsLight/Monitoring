const db = require("../config/db");

// Ambil semua log aktivitas
exports.getLogActivity = async (req, res) => {
  const sql = `SELECT kartu_id, pengguna, created_at FROM log_aktivitas ORDER BY created_at DESC`;

  try {
    const [rows] = await db.execute(sql);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error mengambil data log:", err);
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
    res.json(rows);
  } catch (err) {
    console.error("Error ambil history:", err);
    res.status(500).json({ error: "Gagal ambil data history" });
  }
};

// Ambil Status Terakhir
exports.getDoorStatus = async (req, res) => {
  try {
    // 1. Ambil data terbaru
    const [latestRows] = await pool.query(
      "SELECT status_pintu, created_at FROM log_aktivitas ORDER BY created_at DESC LIMIT 1"
    );

    // 2. Hitung total akses hari ini
    const [totalRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM log_aktivitas 
       WHERE DATE(created_at) = CURDATE()`
    );

    const status_pintu = latestRows[0]?.status_pintu || "Tidak Diketahui";
    const waktu_akses = latestRows[0]?.created_at || null;
    const total_akses = totalRows[0]?.total || 0;

    res.json({
      status_pintu,
      waktu_akses,
      total_akses,
    });
  } catch (error) {
    console.error("Gagal ambil status pintu:", error);
    res.status(500).json({ error: "Gagal ambil data status pintu" });
  }
};