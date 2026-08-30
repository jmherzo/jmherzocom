#!/usr/bin/env node
/**
 * Drift checker: does the one-page Word CV still agree with data/resume.json?
 *
 * The .docx stays the master for the PDF's formatting - this script never
 * writes to it. It extracts the CV's text with macOS `textutil` and reports
 * which cv-targeted facts are missing on either side, so the site and the CV
 * cannot silently diverge.
 *
 *   node scripts/check-resume-sync.mjs
 */
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const resume = JSON.parse(readFileSync(resolve(root, "data/resume.json"), "utf8"));

/**
 * CV-only contact details and the local path to the Word master. Gitignored and
 * read only here - never imported by the app, so it cannot reach the public
 * repo or the client bundle.
 */
const privatePath = resolve(root, "data/resume.private.json");
const priv = existsSync(privatePath)
  ? JSON.parse(readFileSync(privatePath, "utf8"))
  : {};

const docxPath = process.argv[2] ?? process.env.CV_DOCX ?? priv.cvSource;

if (!docxPath) {
  console.error("\x1b[31mNo CV path configured.\x1b[0m");
  console.error("Copy data/resume.private.example.json to data/resume.private.json,");
  console.error("or pass a path: node scripts/check-resume-sync.mjs <file.docx>");
  process.exit(2);
}

if (!existsSync(docxPath)) {
  console.error(`\x1b[31mCV not found:\x1b[0m ${docxPath}`);
  console.error("Pass a path: node scripts/check-resume-sync.mjs <file.docx>");
  process.exit(2);
}

const cvText = execFileSync("textutil", ["-convert", "txt", "-stdout", docxPath], {
  encoding: "utf8",
  maxBuffer: 10 * 1024 * 1024,
});

/** Collapse punctuation/whitespace variance so Word's smart quotes and
 *  en-dashes don't register as differences. */
const norm = (s) =>
  s
    .toLowerCase()
    .replace(/[‘’“”]/g, "'")
    .replace(/[–—−-]/g, " ")
    .replace(/[^a-z0-9'$%+ ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const haystack = norm(cvText);

/** A fact is "present" if a distinctive slice of it appears in the CV. */
function present(text) {
  const n = norm(text);
    if (haystack.includes(n)) return true;
  // Fall back to the first 8 significant words - Word wrapping and small
  // edits shouldn't trigger a false alarm on an otherwise-matching bullet.
  const probe = n.split(" ").filter((w) => w.length > 3).slice(0, 8).join(" ");
  return probe.length > 20 && haystack.includes(probe);
}

const missingFromCv = [];
const cvOnly = [];

// 1. Facts flagged for the CV that the .docx no longer contains.
for (const job of resume.work) {
  if (!present(job.company)) {
    missingFromCv.push(`work: ${job.company} - ${job.position} (whole entry)`);
    continue;
  }
  if (!present(job.position)) {
    missingFromCv.push(`title: ${job.company} -> "${job.position}"`);
  }
  for (const h of job.highlights ?? []) {
    if (!h.targets.includes("cv")) continue;
    const text = h.cvText ?? h.text;
    if (!present(text)) {
      missingFromCv.push(`${job.company}: "${text.slice(0, 70)}..."`);
    }
  }
}

for (const p of resume.projects) {
  if (!(p.targets ?? []).includes("cv")) continue;
  if (!present(p.name)) missingFromCv.push(`project: ${p.name}`);
}

for (const e of resume.education) {
  if (!present(e.institution)) missingFromCv.push(`education: ${e.institution}`);
}

// 2. Headline facts that must match exactly.
const scalars = [
  ["label", resume.basics.label],
  ["email (CV)", priv.emailCv],
  ["phone (CV)", priv.phoneCv],
  ["profile summary", resume.basics.summaryCv],
];
for (const [name, value] of scalars) {
  if (!value) continue; // not configured in resume.private.json
  if (!present(value)) missingFromCv.push(`basics.${name}: "${value.slice(0, 60)}"`);
}

// 3. Company names in the CV that resume.json has never heard of.
const known = new Set(resume.work.map((w) => norm(w.company)));
for (const line of cvText.split("\n")) {
  const t = line.trim();
  if (t.length < 3 || t.length > 40 || !/^[A-Z]/.test(t) || t.includes(" - ")) continue;
  if (/@|\d{4}|Technologies|Education|Experience|Profile|Projects|Languages|GPA|Email|Mobile/i.test(t)) continue;
  if (!known.has(norm(t)) && norm(t).split(" ").length <= 3) cvOnly.push(t);
}

const g = (s) => `\x1b[32m${s}\x1b[0m`;
const r = (s) => `\x1b[31m${s}\x1b[0m`;
const y = (s) => `\x1b[33m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

console.log(`\n  resume.json  ${dim("vs")}  ${docxPath.split("/").pop()}\n`);

if (missingFromCv.length === 0) {
  console.log(`  ${g("PASS")}  every cv-targeted fact appears in the Word CV\n`);
} else {
  console.log(`  ${r(`${missingFromCv.length} cv-targeted fact(s) not found in the CV:`)}\n`);
  for (const m of missingFromCv) console.log(`    - ${m}`);
  console.log(
    dim(
      "\n  Either the CV was edited and resume.json needs updating, or the\n" +
      "  bullet should drop its \"cv\" target and stay web-only.\n",
    ),
  );
}

const unknown = [...new Set(cvOnly)];
if (unknown.length) {
  console.log(`  ${y("Possible headings in the CV that resume.json doesn't know:")}`);
  for (const c of unknown) console.log(`    ? ${c}`);
  console.log("");
}

process.exit(missingFromCv.length ? 1 : 0);
