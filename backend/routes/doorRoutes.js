const express = require("express");
const router = express.Router();
const doorController = require("../controllers/doorController");

// Route Log Aktivitas
router.get("/log-aktivitas", doorController.getLogActivity);

// Route History (pakai rentang waktu)
router.get("/history", doorController.getHistory);

//router.get("/status", doorController.getLastDoorStatus);

module.exports = router;
