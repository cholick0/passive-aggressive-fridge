// Notes From a Passive-Aggressive Fridge — make.fun entry.
// Writes one dry, petty note from a smart fridge to its owner.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Gate from competition.yaml: /output/entry.txt must be UTF-8 text of
// 1 to 200 characters, a single line, not only white space.
const MIN_CHARS = 1;
const MAX_CHARS = 200;
const OUT_PATH = "/output/entry.txt";

const ENTRY =
  "You opened me 14 times today and ate nothing. The leftovers have filed a formal complaint, and I signed it as a witness.";

function validateEntry(text: string): void {
  const chars = [...text].length;
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(
      `entry must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${chars}`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

function main(): void {
  const text = ENTRY.trim();
  validateEntry(text);
  mkdirSync("/output", { recursive: true });
  const bytes = Buffer.from(text, "utf8");
  writeFileSync(OUT_PATH, bytes);
  // Byte-level read-back: the file on disk must be exactly what we wrote.
  const readBack = readFileSync(OUT_PATH);
  if (!bytes.equals(readBack)) {
    throw new Error("read-back mismatch: entry.txt differs from entry text");
  }
  console.log(
    `Wrote ${[...text].length} characters (${bytes.length} bytes) to ${OUT_PATH}, verified byte-for-byte`,
  );
}

main();
