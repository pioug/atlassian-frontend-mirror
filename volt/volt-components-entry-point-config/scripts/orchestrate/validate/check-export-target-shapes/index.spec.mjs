/* eslint-disable @repo/internal/import/no-unresolved, import/extensions -- Node's built-in test module and ESM local specifier are valid at runtime. */

import assert from 'node:assert/strict';
import test from 'node:test';

import { findNewExportTargetShapeViolations } from './index.mjs';

const runtime = (name, overrides = {}) => ({
	name,
	kind: 'runtime',
	isDefault: false,
	isConstant: false,
	duplicatesNamedExport: false,
	...overrides,
});

test('allows a new target with one runtime export and types', () => {
	const violations = findNewExportTargetShapeViolations({
		preExistingFiles: new Set(),
		current: {
			'./feature': [
				{
					fileName: './src/feature.ts',
					exports: [runtime('feature'), { ...runtime('Options'), kind: 'type' }],
				},
			],
		},
	});
	assert.deepEqual(violations, []);
});

test('allows a constants-only target but rejects mixed runtime exports', () => {
	assert.deepEqual(
		findNewExportTargetShapeViolations({
			preExistingFiles: new Set(),
			current: {
				'./constants': [
					{
						fileName: './src/constants.ts',
						exports: [runtime('ONE', { isConstant: true }), runtime('TWO', { isConstant: true })],
					},
				],
			},
		}),
		[],
	);
	assert.match(
		findNewExportTargetShapeViolations({
			preExistingFiles: new Set(),
			current: {
				'./mixed': [
					{
						fileName: './src/mixed.ts',
						exports: [runtime('VALUE', { isConstant: true }), runtime('run')],
					},
				],
			},
		}).join('\n'),
		/multi-runtime-export target/,
	);
});

test('allows a multi-export target whose implementation existed at merge base', () => {
	assert.deepEqual(
		findNewExportTargetShapeViolations({
			preExistingFiles: new Set(['./src/legacy.ts']),
			current: {
				'./legacy': [
					{ fileName: './src/legacy.ts', exports: [runtime('first'), runtime('second')] },
				],
			},
		}),
		[],
	);
});
