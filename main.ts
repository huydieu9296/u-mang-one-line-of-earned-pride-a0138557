import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// One Line of Earned Pride — a single line, 1 to 240 characters: a
// quiet, earned moment of pride for someone in a scene. The judge
// rewards a concrete scene with a real person, pride earned by effort
// the reader can feel (never asserted), and freshness — no stock
// trophy, podium or graduation. So the entry is a farmer, not a
// graduate: three failed harvests are the effort, the first green
// shoot is the payoff, and the pride arrives in the last clause.
const ENTRY =
  "After three failed harvests, old Tran knelt in his field at dawn, pressed his palm to the first green shoot, and smiled like a man who had just won an argument with the sky.";

const MIN_LEN = 1;
const MAX_LEN = 240;

const HERE = dirname(fileURLToPath(import.meta.url));

// The entry text is also kept in entry.txt next to this script. If it is
// present it must agree with the embedded entry; if it is absent (for
// example a harness that copies only main.ts) the embedded text is used.
function loadEntry(): string {
  const entryPath = join(HERE, "entry.txt");
  if (!existsSync(entryPath)) {
    return ENTRY;
  }
  const fromFile = readFileSync(entryPath, "utf8").trim();
  if (fromFile.length > 0 && fromFile !== ENTRY) {
    throw new Error("entry.txt does not match the entry embedded in main.ts");
  }
  return ENTRY;
}

// One line, in range, no stray whitespace: the bounty counts characters,
// so a trailing newline or a doubled space would change the entry.
function validateEntry(text: string): void {
  if (text.length < MIN_LEN || text.length > MAX_LEN) {
    throw new Error(
      `entry must be ${MIN_LEN}-${MAX_LEN} characters, got ${text.length}`,
    );
  }
  if (text !== text.trim()) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
  if (text.includes("\n")) {
    throw new Error("entry must be exactly one line");
  }
  if (!/[.!?]$/.test(text)) {
    throw new Error("entry must end with terminal punctuation");
  }
}

const TEXT = loadEntry();
validateEntry(TEXT);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), TEXT, "utf8");
console.log(`wrote ${TEXT.length} characters to ${join(outDir, "entry.txt")}`);
