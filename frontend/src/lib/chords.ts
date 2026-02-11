import React from "react";

const CHORDS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Map flats to sharps for consistent transposition
const FLAT_TO_SHARP: Record<string, string> = {
  Db: "C#",
  Eb: "D#",
  Gb: "F#",
  Ab: "G#",
  Bb: "A#",
};

function normalizeChord(token: string) {
  // Split root + modifier, e.g. "C#m7", "G/B", "Bb", "Dbmaj7"
  const match = token.match(/^([A-G](?:#|b)?)(.*)$/);
  if (!match) return { root: null, suffix: token };
  
  let root = match[1];
  // Convert flats to sharps for indexing
  if (root.length === 2 && root[1] === "b") {
    const flatKey = root as keyof typeof FLAT_TO_SHARP;
    root = FLAT_TO_SHARP[flatKey] || root;
  }
  
  return { root, suffix: match[2] };
}

export function transposeChord(chord: string, steps: number): string {
  if (!chord || chord.trim() === "") return chord;
  
  const parts = chord.split("/");
  const main = parts[0].trim();
  const bass = parts[1]?.trim();

  const { root, suffix } = normalizeChord(main);
  if (!root) return chord;

  const index = CHORDS.indexOf(root);
  if (index === -1) return chord;

  const newIndex = (index + steps + CHORDS.length) % CHORDS.length;
  const transposedRoot = CHORDS[newIndex];

  if (!bass) return `${transposedRoot}${suffix}`;

  const bassNorm = normalizeChord(bass);
  if (!bassNorm.root) return `${transposedRoot}${suffix}/${bass}`;
  const bassIndex = CHORDS.indexOf(bassNorm.root);
  if (bassIndex === -1) return `${transposedRoot}${suffix}/${bass}`;
  const newBassIndex = (bassIndex + steps + CHORDS.length) % CHORDS.length;
  const transposedBassRoot = CHORDS[newBassIndex];

  return `${transposedRoot}${suffix}/${transposedBassRoot}${bassNorm.suffix}`;
}

/**
 * Transposes chords in a line while preserving exact spacing and alignment.
 * This ensures chords stay in the same position relative to lyrics.
 * Pads transposed chords to match original length for perfect alignment.
 */
export function transposeChordLine(line: string, steps: number): string {
  if (steps === 0 || !line.trim()) return line;
  
  // Match chord patterns: chord names (C, C#, Dm, F#maj7, G/B, etc.)
  // Use word boundary to match chords, but preserve all whitespace
  // Escape forward slash properly for slash chords like G/B
  const chordPattern = new RegExp(
    "\\b([A-G](?:#|b)?(?:m|maj|dim|aug|sus|add)?(?:\\d+|\\/[A-G](?:#|b)?.*)?)\\b",
    "g"
  );
  
  // Process in reverse to maintain string indices
  const matches: Array<{ index: number; length: number; chord: string }> = [];
  let match;
  
  // Reset regex lastIndex
  chordPattern.lastIndex = 0;
  
  while ((match = chordPattern.exec(line)) !== null) {
    matches.push({
      index: match.index,
      length: match[0].length,
      chord: match[0],
    });
  }
  
  // Replace from end to start to preserve indices
  let result = line;
  for (let i = matches.length - 1; i >= 0; i--) {
    const { index, length, chord } = matches[i];
    let transposed = transposeChord(chord, steps);
    
    // Pad transposed chord to match original length for perfect alignment
    // This ensures chords stay in the exact same column position
    if (transposed.length !== length) {
      // Pad with spaces to maintain alignment
      if (transposed.length < length) {
        transposed = transposed.padEnd(length, " ");
      } else {
        // If transposed is longer, we can't shrink it, but try to maintain spacing
        // In practice, this is rare and the monospace font helps
      }
    }
    
    // Replace chord while preserving exact spacing around it
    result = result.slice(0, index) + transposed + result.slice(index + length);
  }
  
  return result;
}

/**
 * Converts chord text with highlighted chords into React elements.
 * Chords are highlighted with purple accent color while preserving exact spacing.
 */
export function highlightChords(text: string, keyPrefix: string = ""): React.ReactNode[] {
  if (!text || !text.trim()) return [text];
  
  const chordPattern = new RegExp(
    "\\b([A-G](?:#|b)?(?:m|maj|dim|aug|sus|add)?(?:\\d+|\\/[A-G](?:#|b)?.*)?)\\b",
    "g"
  );
  
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let key = 0;
  
  chordPattern.lastIndex = 0;
  
  while ((match = chordPattern.exec(text)) !== null) {
    // Add text before the chord (preserves all whitespace)
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    
    // Add highlighted chord with purple accent
    parts.push(
      React.createElement(
        "span",
        {
          key: `${keyPrefix}-chord-${key++}`,
          className: "text-purple-300 font-semibold",
        },
        match[0]
      )
    );
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  
  return parts.length > 0 ? parts : [text];
}



