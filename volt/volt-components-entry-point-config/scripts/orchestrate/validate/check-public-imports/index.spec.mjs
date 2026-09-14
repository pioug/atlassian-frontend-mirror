/* eslint-disable @repo/internal/import/no-unresolved -- Node's built-in test module is valid at runtime. */

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const script = new URL('./index.mjs', import.meta.url);

function run(files) {
	const directory = mkdtempSync(join(tmpdir(), 'tmp_rovo_volt_imports_'));
	try {
		for (const [fileName, content] of Object.entries(files)) {
			const filePath = join(directory, fileName);
			const parent = filePath.slice(0, filePath.lastIndexOf('/'));
			// The fixture uses a single src directory, which exists after writing its first file.
			if (fileName === 'package.json') writeFileSync(filePath, content);
			else {
				mkdirSync(parent, { recursive: true });
				writeFileSync(filePath, content);
			}
		}
		return execFileSync(process.execPath, [script.pathname, join(directory, 'package.json')], {
			encoding: 'utf8',
			stdio: 'pipe',
		});
	} finally {
		rmSync(directory, { recursive: true, force: true });
	}
}

test('accepts a public target with resolvable relative imports', () => {
	assert.doesNotThrow(() =>
		run({
			'package.json': JSON.stringify({ name: 'fixture', exports: { '.': './src/index.ts' } }),
			'src/index.ts': "export { value } from './value';",
			'src/value.ts': 'export const value = 1;',
		}),
	);
});

test('rejects an unresolved relative import', () => {
	assert.throws(
		() =>
			run({
				'package.json': JSON.stringify({ name: 'fixture', exports: { '.': './src/index.ts' } }),
				'src/index.ts': "export { value } from './missing';",
			}),
		/cannot resolve/,
	);
});
