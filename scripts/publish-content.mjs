#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rootDir = process.cwd();
const placeholders = new Set(['', '~', 'null', 'NULL', 'undefined', 'pending', 'first']);
const validStatuses = new Set(['draft', 'ready', 'release', 'publish', 'published']);

const targetListRaw = process.env.PUBLISH_TARGETS || '';
const requestedTargets = targetListRaw
  .split(/\r?\n|,/)
  .map((entry) => entry.trim())
  .filter(Boolean);

const explicitTargets = requestedTargets.length > 0;
const forceUpdate = (process.env.PUBLISH_FORCE || '').toLowerCase() === 'true';
const timestampOverride = process.env.PUBLISH_DATETIME || '';

const timestampSource = timestampOverride.trim() || null;
const publishDate = timestampSource ? new Date(timestampSource) : new Date();
if (Number.isNaN(publishDate.getTime())) {
  console.error(`Invalid datetime provided: ${timestampSource}`);
  process.exit(1);
}

const isoTimestamp = publishDate.toISOString().replace(/\.[0-9]{3}Z$/, 'Z');

function collectMarkdownFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') {
      continue;
    }
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectMarkdownFiles(entryPath));
    } else if (/\.mdx?$/.test(entry.name)) {
      files.push(entryPath);
    }
  }
  return files;
}

function resolveTargets(list) {
  return list
    .map((relativePath) => {
      const resolved = path.resolve(rootDir, relativePath);
      if (!fs.existsSync(resolved)) {
        console.warn(`Skipping missing file: ${relativePath}`);
        return null;
      }
      return resolved;
    })
    .filter(Boolean);
}

function normaliseStatus(value) {
  const raw = stripQuotes(value || '').toLowerCase();
  if (!raw) return '';
  if (raw === 'true') return 'draft';
  if (raw === 'false') return 'published';
  if (raw === 'first') return 'ready';
  if (validStatuses.has(raw)) return raw;
  return '';
}

function findCandidateFiles() {
  // Scan known content directories. Explicit targets via PUBLISH_TARGETS remain unaffected.
  const contentDirs = ['notes', 'writing', 'projects', 'journal'].map((d) => path.join(rootDir, 'src', 'content', d));
  const allMarkdown = contentDirs.flatMap((dir) => (fs.existsSync(dir) ? collectMarkdownFiles(dir) : []));
  const candidates = [];

  for (const filePath of allMarkdown) {
    const preview = fs.readFileSync(filePath, 'utf8');
    if (!preview.startsWith('---')) {
      continue;
    }
    const newline = preview.includes('\r\n') ? '\r\n' : '\n';
    const closing = preview.indexOf(`${newline}---`, 3);
    if (closing === -1) {
      continue;
    }
    const frontmatterRaw = preview.slice(3 + newline.length, closing);
    const lines = frontmatterRaw.split(newline);

    // The only supported status field is 'status:'. The 'draft:' field is a legacy
    // boolean form that processFile() will migrate to 'status:' on write.
    const statusLine = lines.find((line) => line.trim().startsWith('status:'));
    const draftLine = lines.find((line) => line.trim().startsWith('draft:'));

    const statusValueRaw = statusLine ? normaliseStatus(extractValue(statusLine)) : '';
    const draftStatusValue = draftLine ? normaliseStatus(extractValue(draftLine)) : '';
    const statusValue = statusValueRaw || draftStatusValue || 'draft';

    const pubLine = lines.find((line) => line.trim().startsWith('pubDatetime:'));
    const pubValue = pubLine ? extractValue(pubLine) : '';

    // needsMigration: file uses the legacy 'draft:' boolean; processFile will rewrite it to 'status:'
    const needsMigration = Boolean(draftLine);
    const readyForPublish = statusValue === 'ready' || statusValue === 'release' || statusValue === 'publish';

    // Skip already-published articles with valid pubDatetime unless they need migration
    const hasValidPubDate = Boolean(pubValue) && !placeholders.has(pubValue) && pubValue.endsWith('Z') && !/\.[0-9]{3}Z$/.test(pubValue);
    const alreadyPublished = statusValue === 'published' && hasValidPubDate;

    if (alreadyPublished && !needsMigration) {
      continue;
    }

    if (needsMigration || readyForPublish) {
      candidates.push(filePath);
    }
  }

  return candidates;
}

function findChangedPublishedFiles(excludePaths) {
  // Detect already-published files that changed in the current push and update their modDatetime.
  // Skipped entirely when explicit targets are provided.
  const diffBase = (process.env.GIT_DIFF_BASE || '').trim() || 'HEAD~1';
  let changedRelative;
  try {
    const output = execSync(`git diff ${diffBase} HEAD --name-only`, { encoding: 'utf8' });
    changedRelative = output.trim().split('\n').filter(Boolean);
  } catch {
    return []; // git unavailable or no prior commit
  }

  const excludeSet = new Set(excludePaths);
  const contentPrefixes = ['notes', 'writing', 'projects', 'journal'].map(
    (d) => `src/content/${d}/`
  );

  const candidates = [];
  for (const rel of changedRelative) {
    const normalised = rel.replace(/\\/g, '/');
    if (!contentPrefixes.some((p) => normalised.startsWith(p))) continue;
    if (!/\.mdx?$/.test(normalised)) continue;

    const filePath = path.resolve(rootDir, normalised);
    if (excludeSet.has(filePath)) continue;
    if (!fs.existsSync(filePath)) continue;

    const preview = fs.readFileSync(filePath, 'utf8');
    if (!preview.startsWith('---')) continue;
    const nl = preview.includes('\r\n') ? '\r\n' : '\n';
    const closing = preview.indexOf(`${nl}---`, 3);
    if (closing === -1) continue;

    const fmLines = preview.slice(3 + nl.length, closing).split(nl);
    const statusLine = fmLines.find((l) => l.trim().startsWith('status:'));
    const pubLine = fmLines.find((l) => l.trim().startsWith('pubDatetime:'));
    const pubValue = pubLine ? extractValue(pubLine) : '';
    const statusValue = statusLine ? normaliseStatus(extractValue(statusLine)) : '';
    const hasValidPub =
      Boolean(pubValue) &&
      !placeholders.has(pubValue) &&
      pubValue.endsWith('Z') &&
      !/\.[0-9]{3}Z$/.test(pubValue);

    if (statusValue === 'published' && hasValidPub) {
      candidates.push(filePath);
    }
  }
  return candidates;
}

function extractValue(line) {
  const delimiter = line.indexOf(':');
  if (delimiter === -1) {
    return '';
  }
  const value = line.slice(delimiter + 1).trim();
  return stripQuotes(value);
}

function stripQuotes(value) {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1).trim();
  }
  return value;
}

function buildLine(key, value) {
  return `${key}: ${value}`;
}

function normaliseTimestamp(value) {
  if (!value) {
    return { action: 'set', value: isoTimestamp };
  }
  const trimmed = stripQuotes(value.trim());
  if (forceUpdate) {
    return { action: 'set', value: isoTimestamp };
  }
  if (placeholders.has(trimmed)) {
    return { action: 'set', value: isoTimestamp };
  }

  let normalized = trimmed;
  let changed = false;

  if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}$/.test(normalized)) {
    normalized = `${normalized}:00Z`;
    changed = true;
  } else if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}$/.test(normalized)) {
    normalized = `${normalized}Z`;
    changed = true;
  } else if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}$/.test(normalized)) {
    normalized = `${normalized.slice(0, -4)}Z`;
    changed = true;
  } else if (/Z$/i.test(normalized)) {
    const uppercased = normalized.replace(/z$/, 'Z');
    if (uppercased !== normalized) {
      normalized = uppercased;
      changed = true;
    }
    if (/\.[0-9]{3}Z$/.test(normalized)) {
      normalized = normalized.replace(/\.[0-9]{3}Z$/, 'Z');
      changed = true;
    }
  } else if (/^[0-9]{4}.*[+-][0-9]{2}:[0-9]{2}$/.test(normalized)) {
    normalized = new Date(normalized).toISOString().replace(/\.[0-9]{3}Z$/, 'Z');
    changed = true;
  } else if (!normalized.endsWith('Z')) {
    normalized = `${normalized}Z`;
    changed = true;
  }

  if (changed) {
    return { action: 'update', value: normalized };
  }

  return { action: 'keep', value: normalized };
}

function processFile(filePath, options = {}) {
  const raw = fs.readFileSync(filePath, 'utf8');
  if (!raw.startsWith('---')) {
    console.warn(`Skipping "${path.relative(rootDir, filePath)}": no frontmatter found.`);
    return false;
  }

  const newline = raw.includes('\r\n') ? '\r\n' : '\n';
  const closingIndex = raw.indexOf(`${newline}---`, 3);
  if (closingIndex === -1) {
    console.warn(`Skipping "${path.relative(rootDir, filePath)}": missing closing frontmatter delimiter.`);
    return false;
  }

  const headerStart = 3 + newline.length;
  const frontmatterRaw = raw.slice(headerStart, closingIndex);
  const body = raw.slice(closingIndex + (newline.length + 3));

  const lines = frontmatterRaw.split(newline);

  const lookupIndex = (key) => lines.findIndex((line) => line.trim().startsWith(`${key}:`));

  let changed = false;

  // Remove duplicate frontmatter keys (keep first occurrence)
  const seenKeys = new Set();
  for (let i = lines.length - 1; i >= 0; i--) {
    const colonIdx = lines[i].indexOf(':');
    if (colonIdx > 0) {
      const key = lines[i].slice(0, colonIdx).trim();
      if (key && !/^\s/.test(lines[i]) && seenKeys.has(key)) {
        lines.splice(i, 1);
        changed = true;
      } else {
        seenKeys.add(key);
      }
    }
  }

  // modOnly: update modDatetime for already-published files that were edited (git diff pass)
  if (options.modOnly) {
    const modIdx = lookupIndex('modDatetime');
    const newModLine = buildLine('modDatetime', isoTimestamp);
    if (modIdx === -1) {
      lines.push(newModLine);
      changed = true;
    } else if (lines[modIdx] !== newModLine) {
      lines[modIdx] = newModLine;
      changed = true;
    }
    if (!changed) return false;
    const updatedFrontmatter = lines.join(newline);
    const updated = `---${newline}${updatedFrontmatter}${newline}---${body}`;
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`Updated modDatetime in ${path.relative(rootDir, filePath)}`);
    return true;
  }

  let statusIndex = lookupIndex('status');
  const draftIndex = lookupIndex('draft');
  let statusValue = statusIndex === -1 ? '' : normaliseStatus(extractValue(lines[statusIndex]));

  if (draftIndex !== -1) {
    const derivedStatus = normaliseStatus(extractValue(lines[draftIndex]));
    if (!statusValue) {
      statusValue = derivedStatus;
      lines.splice(draftIndex, 1, buildLine('status', derivedStatus));
      statusIndex = draftIndex;
    } else {
      lines.splice(draftIndex, 1);
      if (draftIndex < statusIndex) {
        statusIndex -= 1;
      }
    }
    changed = true;
  }

  if (!statusValue) {
    statusValue = 'draft';
  }

  if (statusIndex === -1) {
    lines.push(buildLine('status', statusValue));
    statusIndex = lines.length - 1;
    changed = true;
  } else {
    const normalisedLine = buildLine('status', statusValue);
    if (lines[statusIndex] !== normalisedLine) {
      lines[statusIndex] = normalisedLine;
      changed = true;
    }
  }

  if (!options.explicit && statusValue === 'draft') {
    if (!changed) {
      return false;
    }
  }

  let nextStatus = statusValue;
  const isReadyToPublish = statusValue === 'ready' || statusValue === 'publish' || statusValue === 'release';

  if (isReadyToPublish) {
    nextStatus = 'published';
  }

  if (nextStatus !== statusValue) {
    lines[statusIndex] = buildLine('status', nextStatus);
    statusValue = nextStatus;
    changed = true;
  }

  const pubIndexInitial = lookupIndex('pubDatetime');
  const existingPub = pubIndexInitial === -1 ? '' : extractValue(lines[pubIndexInitial]);

  if (statusValue === 'published') {
    // If status was 'ready'/'release'/'publish', always set a new publish date (even if one exists).
    // This allows republishing by setting status back to one of those values.
    const shouldSetNewDate = isReadyToPublish || !existingPub || placeholders.has(stripQuotes(existingPub.trim()));

    if (shouldSetNewDate) {
      const newLine = buildLine('pubDatetime', isoTimestamp);
      if (pubIndexInitial === -1) {
        lines.push(newLine);
      } else {
        lines[pubIndexInitial] = newLine;
      }
      changed = true;
    } else {
      // Normalize existing timestamp format if needed
      const pubDecision = normaliseTimestamp(existingPub);
      if (pubDecision.action === 'update') {
        lines[pubIndexInitial] = buildLine('pubDatetime', pubDecision.value);
        changed = true;
      }
    }
  } else if (pubIndexInitial !== -1 && statusValue !== 'published' && forceUpdate) {
    lines.splice(pubIndexInitial, 1);
    pubIndex = -1;
    changed = true;
  }

  const modIndexInitial = lookupIndex('modDatetime');
  const existingMod = modIndexInitial === -1 ? '' : extractValue(lines[modIndexInitial]);
  const modIsPlaceholder = !existingMod || placeholders.has(stripQuotes(existingMod.trim()));

  if (isReadyToPublish) {
    if (modIsPlaceholder) {
      // First publish with no prior modDatetime: align with pubDatetime so the
      // Datetime component's "modDatetime > pubDatetime" guard suppresses the
      // update indicator (correct — content wasn't modified after publish).
      const newModLine = buildLine('modDatetime', isoTimestamp);
      if (modIndexInitial === -1) {
        lines.push(newModLine);
      } else {
        lines[modIndexInitial] = newModLine;
      }
      changed = true;
    } else {
      // Author pre-set a real modDatetime — preserve it; normalize format only.
      const modDecision = normaliseTimestamp(existingMod);
      if (modDecision.action !== 'keep') {
        lines[modIndexInitial] = buildLine('modDatetime', modDecision.value);
        changed = true;
      }
    }
  } else if (modIndexInitial !== -1) {
    // Not publishing: normalize existing modDatetime format if needed.
    const modDecision = normaliseTimestamp(existingMod);
    if (modDecision.action === 'update') {
      lines[modIndexInitial] = buildLine('modDatetime', modDecision.value);
      changed = true;
    }
  }

  if (!changed) {
    return false;
  }

  const updatedFrontmatter = lines.join(newline);
  const updated = `---${newline}${updatedFrontmatter}${newline}---${body}`;
  fs.writeFileSync(filePath, updated, 'utf8');
  console.log(`Updated ${path.relative(rootDir, filePath)}`);
  return true;
}

function main() {
  const files = explicitTargets ? resolveTargets(requestedTargets) : findCandidateFiles();
  const modOnlyFiles = explicitTargets ? [] : findChangedPublishedFiles(files);

  if (files.length === 0 && modOnlyFiles.length === 0) {
    console.log('No changes were necessary.');
    return;
  }

  let updatedCount = 0;
  for (const filePath of files) {
    const changed = processFile(filePath, { explicit: explicitTargets });
    if (changed) {
      updatedCount += 1;
    }
  }

  for (const filePath of modOnlyFiles) {
    const changed = processFile(filePath, { modOnly: true });
    if (changed) {
      updatedCount += 1;
    }
  }

  if (updatedCount === 0) {
    console.log('No changes were necessary.');
  } else {
    console.log(`Applied publish metadata to ${updatedCount} file(s).`);
  }
}

main();
