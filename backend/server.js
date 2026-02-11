require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/songs");
const { seedSampleSongs } = require("./seed/sampleSongs");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "Arise Worship" });
});

app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
// Additional routes for latest/popular (mounted on songs router)
app.get("/api/latest", async (req, res) => {
  const Song = require("./models/Song");
  try {
    const limit = parseInt(req.query.limit) || 5;
    const songs = await Song.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("title artist primaryLanguage categories views createdAt _id");
    res.json(songs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/popular", async (req, res) => {
  const Song = require("./models/Song");
  try {
    const limit = parseInt(req.query.limit) || 5;
    const songs = await Song.find({})
      .sort({ views: -1 })
      .limit(limit)
      .select("title artist primaryLanguage categories views createdAt _id");
    res.json(songs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/arise_worship";

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    await seedSampleSongs();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error", err);
    process.exit(1);
  });



