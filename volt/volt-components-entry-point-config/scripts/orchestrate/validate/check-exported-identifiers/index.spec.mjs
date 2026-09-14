/* eslint-disable @repo/internal/import/no-unresolved, import/extensions -- Node's built-in test module and ESM local specifier are valid at runtime. */

import assert from 'node:assert/strict';
import test from 'node:test';
import { resolve } from 'node:path';

import { buildExportMap, findExportCompatibilityViolations } from './index.mjs';

const packageJsonPath = resolve('/tmp/volt-export-fixture/package.json');

function fixture({ baselineExports, currentExports, baselineFiles, currentFiles }) {
	const withPackageJson = (exports, files) =>
		new Map([
			[packageJsonPath, JSON.stringify({ exports })],
			...Object.entries(files).map(([fileName, source]) => [
				resolve('/tmp/volt-export-fixture', fileName),
				source,
			]),
		]);
	const baseline = withPackageJson(baselineExports, baselineFiles);
	const current = withPackageJson(currentExports, currentFiles);
	const readFrom = (files) => async (filePath) => {
		const source = files.get(filePath);
		if (source === undefined) throw new Error(`Missing fixture file ${filePath}`);
		return source;
	};
	return buildExportMap({
		packageJsonPath,
		readCurrentFile: readFrom(current),
		readBaselineFile: readFrom(baseline),
	});
}

test('allows a simple re-export to target an equivalent direct export', async () => {
	const exportMap = await fixture({
		baselineExports: { './feature': './src/entry-points/feature.ts' },
		currentExports: { './feature': './src/feature.ts' },
		baselineFiles: {
			'./src/entry-points/feature.ts': "export { feature } from '../feature';",
		},
		currentFiles: {
			'./src/feature.ts': 'export const feature = () => undefined;',
		},
	});

	assert.deepEqual(findExportCompatibilityViolations(exportMap), []);
});

test('rejects replacing a pre-existing multi-export implementation file', async () => {
	const exportMap = await fixture({
		baselineExports: { './feature': './src/feature.ts' },
		currentExports: { './feature': './src/first.ts' },
		baselineFiles: {
			'./src/feature.ts': 'export let first = 1; export let second = 2;',
		},
		currentFiles: {
			'./src/first.ts': 'export const first = 1;',
		},
	});

	assert.match(
		findExportCompatibilityViolations(exportMap).join('\n'),
		/Removed existing multi-runtime-export file \.\/src\/feature\.ts/,
	);
});

test('leaves multi-export target eligibility to the shape validator', async () => {
	const exportMap = await fixture({
		baselineExports: { './feature': './src/feature.ts' },
		currentExports: {
			'./feature': './src/feature.ts',
			'./new-feature': './src/new-feature.ts',
		},
		baselineFiles: {
			'./src/feature.ts': 'export const feature = 1;',
		},
		currentFiles: {
			'./src/feature.ts': 'export const feature = 1;',
			'./src/new-feature.ts': 'export let first = 1; export let second = 2;',
		},
	});

	assert.deepEqual(findExportCompatibilityViolations(exportMap), []);
});

test('records a default export that duplicates a named export', async () => {
	const exportMap = await fixture({
		baselineExports: { './feature': './src/feature.ts' },
		currentExports: { './feature': './src/feature.ts' },
		baselineFiles: {
			'./src/feature.ts': 'const Feature = 1; export { Feature }; export default Feature;',
		},
		currentFiles: {
			'./src/feature.ts': 'const Feature = 1; export { Feature }; export default Feature;',
		},
	});

	assert.deepEqual(exportMap.baseline['./feature'][0].exports, [
		{
			name: 'default',
			kind: 'runtime',
			isDefault: true,
			localName: 'Feature',
			isReExport: false,
			isConstant: false,
			duplicatesNamedExport: true,
		},
		{
			name: 'Feature',
			kind: 'runtime',
			isDefault: false,
			localName: 'Feature',
			isReExport: false,
			isConstant: false,
			duplicatesNamedExport: false,
		},
	]);
});
