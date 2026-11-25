// Make the AI Judge Laugh — v2 resubmission (revised).
// One original office-life joke, a single line under 200 characters.
// Revised pass: the line is assembled from setup + twist segments,
// validated in structural-first order, then written byte-exact
// (no trailing newline) to entry.txt.
// Deterministic, Node 22 stdlib only, no network access.
import * as fs from "node:fs";
import * as path from "node:path";

// The joke is built from a setup and a punchline segment so the
// twist (the printer treating quitting as a reusable document)
// stays visually separate from the premise in the source.
type JokeSegments = { readonly setup: string; readonly twist: string };

function jokeSegments(): JokeSegments {
  return {
    setup: "Our printer has printed my resignation letter so often",
    twist: "it now asks if I want to save it as a template.",
  };
}

function assembleJokeLine(): string {
  const { setup, twist } = jokeSegments();
  // Single space between the two halves; no other joining characters.
  return `${setup} ${twist}`;
}

function validateEntryLine(text: string): void {
  const problems: string[] = [];
  // Structural checks first, then length, then surface formatting.
  if (/[\n\r]/.test(text)) problems.push("contains a line break");
  if (/  /.test(text)) problems.push("contains a double space");
  if (text.length < 1) problems.push("empty");
  if (text.length > 200) problems.push(`too long (${text.length} chars)`);
  if (!text.endsWith(".")) problems.push("does not end with a full stop");
  if (text.trim() !== text) problems.push("leading/trailing whitespace");
  if (problems.length > 0) {
    throw new Error(`invalid entry: ${problems.join("; ")}`);
  }
}

function resolveEntryOutputDir(): string {
  const configured = process.env.MAKEFUN_OUTPUT_DIR;
  if (configured !== undefined && configured !== "") return configured;
  return "/output";
}

function writeEntryFile(entry: string, dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "entry.txt"), entry, { encoding: "utf8" });
}

function run(): void {
  const entry = assembleJokeLine();
  validateEntryLine(entry);
  writeEntryFile(entry, resolveEntryOutputDir());
  process.stdout.write(`entry (${entry.length} chars): ${entry}\n`);
}

run();
