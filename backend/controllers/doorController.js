const db = require("../config/db");

// Ambil semua log aktivitas
exports.getLogActivity = (req, res) => {
  const sql = `SELECT kartu_id, pengguna, created_at FROM log_aktivitas ORDER BY created_at DESC`;

  db.query(sql, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Gagal mengambil data log", error: err });

    res.status(200).json(result);
  });
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
