const express = require("express");
const Song = require("../models/Song");
const auth = require("../middleware/auth");

const router = express.Router();

// Public: list + filters
router.get("/", async (req, res) => {
  const { q, language, category, difficulty } = req.query;
  const filter = {};

  if (language) {
    filter.primaryLanguage = language;
  }

  if (category) {
    filter.categories = category;
  }

  if (difficulty) {
    filter.difficulty = difficulty;
  }

  if (q) {
    filter.title = { $regex: q, $options: "i" };
  }

  try {
    const songs = await Song.find(filter).sort({ title: 1 });
    res.json(songs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Public: get single song (increments view count)
router.get("/:id", async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
    res.json(song);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Admin: create
router.post("/", auth, async (req, res) => {
  try {
    const song = new Song(req.body);
    await song.save();
    res.status(201).json(song);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Validation error", error: err.message });
  }
});

// Admin: update
router.put("/:id", auth, async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
    res.json(song);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Validation error", error: err.message });
  }
});

// Admin: delete
router.delete("/:id", auth, async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
    res.json({ message: "Song deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;



