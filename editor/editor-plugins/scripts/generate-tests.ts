// Ignored via go/ees005
// eslint-disable-next-line import/no-namespace
import * as fs from 'fs';
import path from 'path';

import type { EntryPointData } from './entrypoint-data';
import { formatCode } from './util';

export function generateAllPluginTests(
	pluginToEntryPointsMap: Record<string, EntryPointData[]>,
	testsPath: string,
) {
	// Delete the files in the tests directory, leave folders alone
	if (fs.existsSync(testsPath)) {
		// Read the contents of the directory
		const files = fs.readdirSync(testsPath);

		// Iterate over each item in the directory
		for (const file of files) {
			// Create the full path for each item
			const fullPath = path.join(testsPath, file);

			// Check if the item is a file
			if (fs.statSync(fullPath).isFile()) {
				// Delete the file
				fs.unlinkSync(fullPath);
			}
		}
	}

	for (const [pluginName, entryPointData] of Object.entries(pluginToEntryPointsMap)) {
		generatePluginTest(pluginName, entryPointData, path.join(testsPath, `${pluginName}.ts`));
	}
}

function generatePluginTest(
	pluginName: string,
	entryPointData: EntryPointData[],
	testPath: string,
) {
	const entrypointTests = entryPointData.map(generateEntryPointTest).join('\n');
	const content = `
// THIS FILE IS GENERATED. DO NOT MODIFY IT MANUALLY.
export {};

describe('${pluginName} wrapper', () => {
  ${entrypointTests.trimStart()}
});`;
	const formatted = formatCode(content);
	fs.writeFileSync(testPath, formatted);
}

function generateEntryPointTest(entryPointData: EntryPointData) {
	const wrapperImport = entryPointData.afExportData.newAfExportValue
		.replace('src/', '')
		.replace('.ts', '');
	return `
  it('check ${entryPointData.afExportData.newAfExportKey} exports all the same variables as the original', () => {
    const original = require('${entryPointData.atlaskitImportName}');
    const wrapper = require('.${wrapperImport}');
    const originalKeys = Object.keys(original).sort();
    const wrapperKeys = Object.keys(wrapper).sort();
    expect(originalKeys).toEqual(wrapperKeys);
  });`;
}
