/* eslint-disable no-console */
import fs from 'fs/promises';
import path from 'path';

import { v4 as uuidv4 } from 'uuid';

import { ReplacementDetail, TransformationDetails } from '../types';

async function writeToCsv(filePath: string, data: string[]): Promise<void> {
	await fs.writeFile(filePath, data.join('\n'), 'utf-8');
}

async function readCsv(filePath: string) {
	const data = await fs.readFile(filePath, 'utf-8');
	return data.split('\n').filter((line) => line.trim() !== '');
}

function escapeCsvValue(value: string): string {
	if (!value) {
		return value;
	}
	if (value.includes('"')) {
		// Escape double quotes by doubling them
		value = value.replace(/"/g, '""');
	}
	if (value.includes(',') || value.includes('"') || value.includes('\n')) {
		// Surround the value with double quotes if it contains a comma, double quotes, or newlines
		value = `"${value}"`;
	}
	return value;
}

export async function clearFolder(reportFolder: string) {
	console.log('Clearing report folder:', reportFolder);
	const filesToDelete = await fs.readdir(reportFolder);
	for (const file of filesToDelete) {
		const filePath = path.join(reportFolder, file);
		await fs.unlink(filePath);
	}
}

export async function combineReports(reportFolder: string) {
	console.log('Combining reports in folder:', reportFolder);
	const files = await fs.readdir(reportFolder);
	let totalReplaced = 0;
	let totalNotReplaced = 0;
	const combinedReplacements = [];
	const combinedNonReplacements = [];

	for (const file of files) {
		const filePath = path.join(reportFolder, file);
		if (file.endsWith('_success.csv')) {
			const replacements = await readCsv(filePath);
			totalReplaced += replacements.length;
			combinedReplacements.push(...replacements);
		} else if (file.endsWith('_failed.csv')) {
			const nonReplacements = await readCsv(filePath);
			totalNotReplaced += nonReplacements.length;
			combinedNonReplacements.push(...nonReplacements);
		}
	}

	const totalTokens = totalReplaced + totalNotReplaced;
	const percentageReplaced = totalTokens > 0 ? (totalReplaced / totalTokens) * 100 : 0;

	await clearFolder(reportFolder);

	// Write combined summary as JSON
	const combinedSummaryPath = path.join(reportFolder, 'summary.json');
	const summaryData = {
		totalReplaced,
		totalNotReplaced,
		percentageReplaced,
	};
	await fs.writeFile(combinedSummaryPath, JSON.stringify(summaryData, null, 2), 'utf-8');

	// Sort the combined arrays
	const sortCsvLines = (lines: string[]) => {
		return lines.sort((a, b) => {
			const aCols = a.split(',');
			const bCols = b.split(',');
			for (let i = 0; i < 4; i++) {
				const comparison = aCols[i].localeCompare(bCols[i]);
				if (comparison !== 0) {
					return comparison;
				}
			}
			return 0;
		});
	};
	const sortedReplacements = sortCsvLines(combinedReplacements);
	const sortedNonReplacements = sortCsvLines(combinedNonReplacements);

	// Write combined replacements
	const combinedReplacementsPath = path.join(reportFolder, 'success.csv');
	const header =
		'Team,Package,File,Line Number,Raw Token Key,Raw Fallback Value,Resolved Token Value,Resolved Fallback Value,Difference %';
	await fs.writeFile(combinedReplacementsPath, [header, ...sortedReplacements].join('\n'), 'utf-8');

	// Write combined non-replacements
	const combinedNonReplacementsPath = path.join(reportFolder, 'failed.csv');
	await fs.writeFile(
		combinedNonReplacementsPath,
		[header, ...sortedNonReplacements].join('\n'),
		'utf-8',
	);
}

function prepareCsvData(items: ReplacementDetail[]): string[] {
	return items.map((item) =>
		[
			escapeCsvValue(item.teamInfo.teamName),
			escapeCsvValue(item.teamInfo.packageName),
			escapeCsvValue(item.filePath),
			escapeCsvValue(String(item.lineNumber)),
			escapeCsvValue(item.tokenKey),
			escapeCsvValue(item.rawFallbackValue),
			escapeCsvValue(item.resolvedTokenValue),
			escapeCsvValue(item.resolvedFallbackValue),
			escapeCsvValue(item.difference?.toFixed(1) ?? ''),
		].join(','),
	);
}

export async function writeReports(details: TransformationDetails, reportFolder: string) {
	const replacementsFilePath = path.join(reportFolder, `${uuidv4()}_success.csv`);
	const nonReplacementsFilePath = path.join(reportFolder, `${uuidv4()}_failed.csv`);
	await fs.mkdir(reportFolder, { recursive: true });
	const replacementData = prepareCsvData(details.replaced);
	const nonReplacementData = prepareCsvData(details.notReplaced);
	await Promise.all([
		writeToCsv(replacementsFilePath, replacementData),
		writeToCsv(nonReplacementsFilePath, nonReplacementData),
	]);
}
