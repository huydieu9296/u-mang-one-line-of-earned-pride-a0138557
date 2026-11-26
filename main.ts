import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// One Line of Earned Pride: one line, at most 240 characters.
const ENTRY =
  "After three failed harvests, old Tran knelt in his field at dawn, pressed his palm to the first green shoot, and smiled like a man who had just won an argument with the sky.";

const HERE = dirname(fileURLToPath(import.meta.url));

// The entry text is also kept in entry.txt next to this script. If it is
// present it must agree with the embedded entry; if it is absent (for
// example a harness that copies only main.ts) the embedded text is used.
let TEXT = ENTRY;
const entryPath = join(HERE, "entry.txt");
if (existsSync(entryPath)) {
  const fromFile = readFileSync(entryPath, "utf8").trim();
  if (fromFile.length > 0 && fromFile !== ENTRY) {
    throw new Error("entry.txt does not match the entry embedded in main.ts");
  }
}

if (TEXT.length < 1 || TEXT.length > 240) {
  throw new Error(`entry must be 1-240 characters, got ${TEXT.length}`);
}
if (TEXT.includes("\n")) {
  throw new Error("entry must be exactly one line");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), TEXT, "utf8");
console.log(`wrote ${TEXT.length} characters to ${join(outDir, "entry.txt")}`);
