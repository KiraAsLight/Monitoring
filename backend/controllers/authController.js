const bcrypt = require("bcrypt");
const crypto = require("crypto");
const db = require("../config/db");
const { sendResetEmail } = require("../utils/mailer");

// Untuk Registrasi User / Admin
// exports.register = async (req, res) => {
//   const { email, password } = req.body;

//   const hashed = await bcrypt.hash(password, 10);
//   try {
//     await db.query(
//       "INSERT INTO pengguna (email, password_hash) VALUES (?, ?)",
//       [email, hashed]
//     );
//     res.json({ message: "Registration successful." });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Registration failed.", error: err.message });
//   }
// };

// Untuk Login User / Admin
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await db.query("SELECT * FROM pengguna WHERE email = ?", [
    email,
  ]);

  if (rows.length === 0)
    return res.status(404).json({ message: "User not found." });

  const match = await bcrypt.compare(password, rows[0].password_hash);
  if (!match) return res.status(401).json({ message: "Wrong password." });

  res.json({ message: "Login successful." });
};

// Untuk Request Reset Password
exports.requestReset = async (req, res) => {
  const { email } = req.body;
  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 3600000); // 1 hour

  const [rows] = await db.query("SELECT * FROM pengguna WHERE email = ?", [
    email,
  ]);
  if (rows.length === 0)
    return res.status(404).json({ message: "User not found." });

  await db.query(
    "UPDATE pengguna SET reset_token = ?, reset_expiry = ? WHERE email = ?",
    [token, expiry, email]
  );
  await sendResetEmail(email, token);
  res.json({ message: "Reset email sent." });
};

// Untuk Validasi Token
exports.validateToken = async (req, res) => {
  const { token } = req.params;
  const [rows] = await db.query(
    "SELECT * FROM pengguna WHERE reset_token = ? AND reset_expiry > NOW()",
    [token]
  );

  if (rows.length === 0)
    return res.status(404).json({ message: "Invalid token." });
  res.json({ message: "Valid token." });
};

// Untuk Reset Password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const [rows] = await db.query(
    "SELECT * FROM pengguna WHERE reset_token = ? AND reset_expiry > NOW()",
    [token]
  );
  if (rows.length === 0)
    return res.status(404).json({ message: "Invalid token." });

  const hashed = await bcrypt.hash(newPassword, 10);
  await db.query(
    "UPDATE pengguna SET password_hash = ?, reset_token = NULL, reset_expiry = NULL WHERE reset_token = ?",
    [hashed, token]
  );
  res.json({ message: "Password reset successful." });
};