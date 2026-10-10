// Verifies that the CSP in dist/_headers allows every inline script in the
// built HTML by hash, lists no stale hashes, and that no inline styles or
// data: URIs in CSS exist (the CSP allows neither). Run after `npm run build`.
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const dist = "dist";
const headers = await readFile(join(dist, "_headers"), "utf8");
const csp = headers.match(/Content-Security-Policy:\s*(.+)/)?.[1];
if (!csp) throw new Error("No Content-Security-Policy in dist/_headers");
const allowed = new Set(
  csp
    .match(/script-src([^;]*)/)?.[1]
    .match(/'sha256-[^']+'/g)
    ?.map((h) => h.slice(1, -1)) ?? [],
);

const files = (await readdir(dist, { recursive: true })).map((f) =>
  join(dist, f),
);
const htmlFiles = files.filter((f) => f.endsWith(".html"));

const found = new Map(); // hash -> first file it appears in
const errors = [];
for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  for (const [, attrs, body] of html.matchAll(
    /<script\b([^>]*)>([\s\S]*?)<\/script>/g,
  )) {
    if (/\bsrc=/.test(attrs)) continue;
    // Data blocks such as JSON-LD are never executed, so CSP ignores them.
    const type = attrs.match(/\btype=["']?([^"'\s>]+)/)?.[1];
    if (type && !/^(module|(text|application)\/javascript)$/.test(type)) {
      continue;
    }
    const hash = `sha256-${createHash("sha256").update(body).digest("base64")}`;
    if (!found.has(hash)) found.set(hash, file);
  }
  if (/<style\b/.test(html) || /\sstyle=/.test(html)) {
    errors.push(`${file}: inline style found; the CSP will block it`);
  }
}

for (const file of files.filter((f) => f.endsWith(".css"))) {
  if (/url\(\s*["']?data:/.test(await readFile(file, "utf8"))) {
    errors.push(`${file}: data: URI found; the CSP will block it`);
  }
}

for (const [hash, file] of found) {
  if (!allowed.has(hash)) {
    errors.push(
      `${file}: inline script hash '${hash}' is missing from the CSP`,
    );
  }
}
for (const hash of allowed) {
  if (!found.has(hash)) {
    errors.push(`CSP lists '${hash}', but no inline script matches it`);
  }
}

if (errors.length > 0) {
  console.error(
    `CSP check failed:\n${errors.map((e) => `  - ${e}`).join("\n")}\n` +
      "Fix the inline content, or update the script-src hashes in public/_headers.",
  );
  process.exit(1);
}
console.log(
  `CSP check passed: ${found.size} inline script hash(es) across ${htmlFiles.length} pages.`,
);
