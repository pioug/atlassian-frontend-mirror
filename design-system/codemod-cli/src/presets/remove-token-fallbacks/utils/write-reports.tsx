/* eslint-disable no-console */
import fs from 'fs/promises';
import path from 'path';

// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import { v4 as uuidv4 } from 'uuid';

import { type ReplacementDetail, type TransformationDetails } from '../types';

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

async function writeToCsv(filePath: string, data: string[]): Promise<void> {
	await fs.writeFile(filePath, data.join('\n'), 'utf-8');
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

export async function writeReports(
	details: TransformationDetails,
	reportFolder: string,
): Promise<void> {
	// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
	const replacementsFilePath = path.join(reportFolder, `${uuidv4()}_success.csv`);
	// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
	const nonReplacementsFilePath = path.join(reportFolder, `${uuidv4()}_failed.csv`);
	await fs.mkdir(reportFolder, { recursive: true });
	const replacementData = prepareCsvData(details.replaced);
	const nonReplacementData = prepareCsvData(details.notReplaced);
	await Promise.all([
		writeToCsv(replacementsFilePath, replacementData),
		writeToCsv(nonReplacementsFilePath, nonReplacementData),
	]);
}
