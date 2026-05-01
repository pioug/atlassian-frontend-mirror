import path from 'path';
import { adfToValidatorSpec } from '@atlaskit/adf-schema-generator';
import adfNode from '../src/next-schema/full-schema.adf';
import { writeToFile } from './helpers/writeToFile';

const outputPath = path.join('src', 'validator-schema', 'generated');

const indent = (level: number) => '\n' + '  '.repeat(level);

/**
 * Emit TypeScript object/array literals.
 *
 * Arrays are intentionally NOT marked `as const`. With `as const`, TypeScript
 * infers `readonly` tuple types for every array, which then fail to satisfy
 * the `Array<string>` (mutable) shape used in the consumer's `ValidatorSpec`
 * type — this surfaced as a TS2352 on `as Record<string, ValidatorSpec>` in
 * `ai-model-io/.../specs/index.ts`.
 *
 * Plain object/array literals (without `as const`) are also fully derivable
 * by `--isolatedDeclarations`, so dropping `as const` is safe for both the
 * adf-schema build and any downstream consumer.
 */
function serializeValidatorJson(value: unknown, depth = 0): string {
	if (value === null) {
		return 'null';
	}
	if (value === undefined) {
		return 'undefined';
	}
	if (typeof value === 'string') {
		return JSON.stringify(value);
	}
	if (typeof value === 'number' || typeof value === 'boolean') {
		return String(value);
	}
	if (Array.isArray(value)) {
		if (value.length === 0) {
			return '[]';
		}
		const inner = value
			.map((item) => serializeValidatorJson(item, depth + 1))
			.join(`,${indent(depth + 1)}`);
		return `[${indent(depth + 1)}${inner}${indent(depth)}]`;
	}
	if (typeof value === 'object') {
		const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
			a.localeCompare(b),
		);
		if (entries.length === 0) {
			return '{}';
		}
		const inner = entries
			.map(([k, v]) => {
				const keyName = /^[a-zA-Z_$][\w$]*$/u.test(k) ? k : JSON.stringify(k);
				return `${keyName}: ${serializeValidatorJson(v, depth + 1)}`;
			})
			.join(`,${indent(depth + 1)}`);
		return `{${indent(depth + 1)}${inner}${indent(depth)}}`;
	}
	throw new Error(`Unsupported value in validator spec: ${typeof value}`);
}

function generateValidatorSpec() {
	const output = adfToValidatorSpec(adfNode);
	return Object.entries(output)
		.map(([key, entry]) => {
			const { json } = entry as { json: unknown };
			return `export const ${key} = ${serializeValidatorJson(json)};`;
		})
		.join('\n\n');
}

function main() {
	const spec = generateValidatorSpec();
	writeToFile('validatorSpec.ts', spec, outputPath);
}

main();
