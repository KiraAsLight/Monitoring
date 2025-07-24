require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const doorRoutes = require("./routes/doorRoutes");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Routes / Routing
app.use("/api/auth", authRoutes);
app.use("/api/door", doorRoutes);

app.get("/", (req, res) => res.send("Smart Door API Active."));

app.listen(process.env.PORT, () => {
    console.log("Server running on http://localhost:" + process.env.PORT);
});