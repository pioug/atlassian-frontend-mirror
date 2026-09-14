/* eslint-disable @repo/internal/import/no-unresolved -- Node's built-in test module is valid at runtime. */

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const script = new URL('./index.mjs', import.meta.url);

function run(exports) {
	const directory = mkdtempSync(join(tmpdir(), 'tmp_rovo_volt_keys_'));
	const packageJson = join(directory, 'package.json');
	writeFileSync(packageJson, JSON.stringify({ name: 'fixture', exports }));
	try {
		return execFileSync(process.execPath, [script.pathname, packageJson], {
			encoding: 'utf8',
			stdio: 'pipe',
		});
	} finally {
		rmSync(directory, { recursive: true, force: true });
	}
}

test('accepts public export keys', () => {
	assert.doesNotThrow(() => run({ '.': './src/index.ts', './feature': './src/feature.ts' }));
});

test('rejects export keys containing src', () => {
	assert.throws(() => run({ './src/feature': './src/feature.ts' }), /invalid exports key/);
});
