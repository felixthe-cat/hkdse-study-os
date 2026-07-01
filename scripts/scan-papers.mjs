// One-off scanner: walks ../past-papers and writes lib/papers-data.json.
// Re-run manually (`node scripts/scan-papers.mjs`) only if papers are added.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..", "..", "past-papers");
const OUT = path.resolve(import.meta.dirname, "..", "lib", "papers-data.json");

// Subjects with a chi/eng language split; we only want the "eng" side.
const LANGUAGE_SPLIT_SUBJECTS = new Set(["Chemistry", "Physics", "Mathematics", "Geography"]);

const PAPER_FILE_RE = /^p(\d)([a-z])?\.pdf$/i;

function subjectLabel(dirName) {
  return dirName.replace(/_/g, " ");
}

function scanDseDir(dseDir, subject) {
  const rows = [];
  if (!fs.existsSync(dseDir)) return rows;
  for (const yearDir of fs.readdirSync(dseDir, { withFileTypes: true })) {
    if (!yearDir.isDirectory() || !/^\d{4}$/.test(yearDir.name)) continue;
    const year = Number(yearDir.name);
    const fullYearDir = path.join(dseDir, yearDir.name);
    for (const file of fs.readdirSync(fullYearDir)) {
      const match = file.match(PAPER_FILE_RE);
      if (!match) continue; // skips ans.pdf, per.pdf, map.pdf, etc.
      const paperType = `Paper ${match[1]}${(match[2] ?? "").toUpperCase()}`;
      rows.push({
        id: `${subject}-${year}-${match[1]}${match[2] ?? ""}`,
        subject,
        subjectLabel: subjectLabel(subject),
        year,
        paperType,
      });
    }
  }
  return rows;
}

const papers = [];
for (const subject of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!subject.isDirectory()) continue;
  const subjectDir = path.join(ROOT, subject.name);
  const dseDir = LANGUAGE_SPLIT_SUBJECTS.has(subject.name)
    ? path.join(subjectDir, "eng", "dse")
    : path.join(subjectDir, "dse");
  papers.push(...scanDseDir(dseDir, subject.name));
}

papers.sort((a, b) => a.subject.localeCompare(b.subject) || a.year - b.year || a.paperType.localeCompare(b.paperType));

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(papers, null, 2));
console.log(`Wrote ${papers.length} papers to ${OUT}`);
