#!/usr/bin/env node

/* eslint-disable no-console -- This command-line reporter writes its human-readable summary to stdout. */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const [command, ...arguments_] = process.argv.slice(2);

if (command === 'append') {
	await appendStage(...arguments_);
} else if (command === 'write') {
	await writeReport(...arguments_);
} else {
	console.error(
		'Usage: report/index.mjs append <manifest> <id> <name> <exit-code> <log-file> | write <manifest> <output> <package-path> <merge-base>',
	);
	process.exitCode = 2;
}

async function appendStage(manifestPath, id, name, exitCode, logFile) {
	await mkdir(dirname(manifestPath), { recursive: true });
	await writeFile(
		manifestPath,
		`${JSON.stringify({ id: Number(id), name, exitCode: Number(exitCode), logFile })}\n`,
		{ flag: 'a' },
	);
}

async function writeReport(manifestPath, outputPath, packagePath, mergeBase) {
	const stages = (await readFile(manifestPath, 'utf8'))
		.trim()
		.split('\n')
		.filter(Boolean)
		.map(JSON.parse);
	for (const stage of stages) {
		stage.log = stage.logFile;
		stage.violations = stage.exitCode === 0 ? [] : await extractViolations(stage, packagePath);
		stage.violationCount = stage.violations.length;
		delete stage.logFile;
	}
	const report = {
		packagePath,
		mergeBase,
		generatedAt: new Date().toISOString(),
		stages,
		success: stages.every(({ exitCode }) => exitCode === 0),
	};
	await mkdir(dirname(outputPath), { recursive: true });
	await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
	printSummary(report);
}

async function extractViolations(stage, packagePath) {
	const log = await readFile(resolve(stage.log), 'utf8');
	const configError = log.match(/ConfigError: ([^\n]+(?:\n[^\n]+)?)/);
	if (configError) {
		return [{ message: `Configuration error: ${configError[1].replace(/\s+/g, ' ')}` }];
	}
	const files = new Set();
	const filePattern = /(?:[\w.-]+\/)+[\w.-]+\.(?:[cm]?[jt]sx?|json)/g;
	const matches =
		stage.id === 6 || stage.id === 7
			? log.matchAll(/^.*\bFAIL\s+([^\s]+\.(?:[cm]?[jt]sx?|json))/gm)
			: log.matchAll(filePattern);
	for (const match of matches) {
		const file = stage.id === 6 || stage.id === 7 ? match[1] : match[0];
		files.add(
			file.startsWith('./') || file.startsWith('src/')
				? `${packagePath}/${file.replace(/^\.\//, '')}`
				: file,
		);
	}
	const listedViolations =
		stage.id === 6 || stage.id === 7 ? 0 : (log.match(/^\s*-\s+/gm)?.length ?? 0);
	const count = Math.max(files.size, listedViolations, 1);
	return [...files]
		.map((file) => ({ file }))
		.concat(
			files.size < count
				? [
						{
							message: `${count - files.size} additional violation${count - files.size === 1 ? '' : 's'}; see log.`,
						},
					]
				: [],
		);
}

function printSummary(report) {
	console.log('# Summary\n');
	for (const stage of report.stages) {
		console.log(
			`- ${stage.id}. ${stage.name}: ${stage.violationCount} violation${stage.violationCount === 1 ? '' : 's'}`,
		);
		for (const violation of stage.violations) {
			console.log(`  - ${violation.file ?? violation.message}`);
		}
	}
}
