#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const placeholders = new Set(['', '~', 'null', 'NULL', 'undefined', 'pending', 'first']);
const publishStatusField = 'publishStatus';
const legacyStatusField = 'status';
const validStatuses = new Set(['draft', 'ready', 'published']);

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
  const contentDir = path.join(rootDir, 'src', 'content');
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  const allMarkdown = collectMarkdownFiles(contentDir);
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

    const publishStatusLine = lines.find((line) => line.trim().startsWith(`${publishStatusField}:`));
    const legacyStatusLine = lines.find((line) => line.trim().startsWith(`${legacyStatusField}:`));
    const draftLine = lines.find((line) => line.trim().startsWith('draft:'));

    const publishStatusValue = publishStatusLine ? normaliseStatus(extractValue(publishStatusLine)) : '';
    const legacyStatusValue = legacyStatusLine ? normaliseStatus(extractValue(legacyStatusLine)) : '';
    const draftStatusValue = draftLine ? normaliseStatus(extractValue(draftLine)) : '';

    let statusValue = publishStatusValue || legacyStatusValue || draftStatusValue;
    if (!statusValue) {
      statusValue = 'draft';
    }

    const pubLine = lines.find((line) => line.trim().startsWith('pubDatetime:'));
    const pubValue = pubLine ? extractValue(pubLine) : '';

    const needsMigration = Boolean(draftLine) || (!publishStatusLine && Boolean(legacyStatusValue));
    const readyForPublish = statusValue === 'ready';
    const needsPublishFix =
      statusValue === 'published' && (!pubLine || placeholders.has(pubValue) || !pubValue.endsWith('Z') || /\.[0-9]{3}Z$/.test(pubValue));

    if (needsMigration || readyForPublish || needsPublishFix) {
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

function processFile(filePath, options) {
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
  if (statusValue === 'ready') {
    nextStatus = 'published';
  }

  if (nextStatus !== statusValue) {
    lines[statusIndex] = buildLine('status', nextStatus);
    statusValue = nextStatus;
    changed = true;
  }

  const pubIndexInitial = lookupIndex('pubDatetime');
  const existingPub = pubIndexInitial === -1 ? '' : extractValue(lines[pubIndexInitial]);

  let pubIndex = pubIndexInitial;
  if (statusValue === 'published') {
    const pubDecision = normaliseTimestamp(existingPub);
    if (pubDecision.action === 'set') {
      const newLine = buildLine('pubDatetime', pubDecision.value);
      if (pubIndexInitial === -1) {
        lines.push(newLine);
        pubIndex = lines.length - 1;
      } else {
        lines[pubIndexInitial] = newLine;
        pubIndex = pubIndexInitial;
      }
      changed = true;
    } else if (pubDecision.action === 'update') {
      lines[pubIndexInitial] = buildLine('pubDatetime', pubDecision.value);
      pubIndex = pubIndexInitial;
      changed = true;
    }
  } else if (pubIndexInitial !== -1 && statusValue !== 'published' && forceUpdate) {
    lines.splice(pubIndexInitial, 1);
    pubIndex = -1;
    changed = true;
  }

  const modLine = buildLine('modDatetime', isoTimestamp);
  const modIndex = lookupIndex('modDatetime');
  if (modIndex === -1) {
    if (pubIndex !== -1) {
      lines.splice(pubIndex + 1, 0, modLine);
    } else {
      lines.push(modLine);
    }
    changed = true;
  } else if (lines[modIndex] !== modLine) {
    lines[modIndex] = modLine;
    changed = true;
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

  if (files.length === 0) {
    console.log('No files matched the publish criteria.');
    return;
  }

  let updatedCount = 0;
  for (const filePath of files) {
    const changed = processFile(filePath, { explicit: explicitTargets });
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
