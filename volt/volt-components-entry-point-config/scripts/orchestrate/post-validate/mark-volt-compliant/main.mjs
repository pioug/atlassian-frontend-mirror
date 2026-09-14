#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const [packagePath] = process.argv.slice(2);
if (!packagePath) throw new Error('Usage: main.mjs <platform-package-path>');
const repositoryRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], {
	encoding: 'utf8',
}).trim();
const presetPath = resolve(repositoryRoot, 'platform/volt-preset-packages.json');
const source = await readFile(presetPath, 'utf8');
const escapedPath = packagePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const entryPattern = new RegExp(`\\{[^\\n]*"dir": "${escapedPath}"[^\\n]*\\}`);
const entry = source.match(entryPattern)?.[0];
if (!entry) throw new Error(`No Volt preset entry found for ${packagePath}.`);
const updatedEntry = /"voltCompliant"\s*:/.test(entry)
	? entry.replace(/"voltCompliant"\s*:\s*(true|false)/, '"voltCompliant": true')
	: entry.replace(/\s*}$/, ', "voltCompliant": true }');
if (updatedEntry !== entry) await writeFile(presetPath, source.replace(entry, updatedEntry));
