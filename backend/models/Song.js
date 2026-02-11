const mongoose = require("mongoose");

const lyricVariantSchema = new mongoose.Schema(
  {
    language: { type: String, required: true }, // e.g. 'english', 'tamil', 'tanglish', 'kannada'
    script: { type: String, enum: ["original", "transliteration"], default: "original" },
    body: { type: String, required: true }, // full lyrics with chord placeholders if desired
  },
  { _id: false }
);

const chordSetSchema = new mongoose.Schema(
  {
    difficulty: { type: String, enum: ["easy", "advanced"], required: true },
    key: { type: String, required: true }, // e.g. 'C', 'G', 'F#'
    body: { type: String, required: true }, // chorded lyrics text or structured representation
  },
  { _id: false }
);

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    artist: { type: String, trim: true },
    primaryLanguage: {
      type: String,
      enum: ["english", "tamil", "kannada", "hindi", "telugu", "malayalam", "other"],
      required: true,
    },
    categories: [{ type: String }], // worship, praise, slow, christmas etc.
    difficulty: { type: String, enum: ["easy", "advanced", "mixed"], default: "mixed" },
    tags: [{ type: String }],
    lyricVariants: [lyricVariantSchema], // multiple language/script bodies
    chordSets: [chordSetSchema], // easy/advanced sets, key-aware
    isTamilWithTanglish: { type: Boolean, default: false },
    isKannadaWithEnglish: { type: Boolean, default: false },
    youtubeUrl: { type: String, trim: true }, // YouTube video URL for the song
    pptUrls: {
      english: { type: String, trim: true },
      tamil: { type: String, trim: true },
      kannada: { type: String, trim: true }
    }, // PPT download URLs for different languages
    views: { type: Number, default: 0 }, // track song views for popularity
  },
  { timestamps: true }
);

module.exports = mongoose.model("Song", songSchema);



