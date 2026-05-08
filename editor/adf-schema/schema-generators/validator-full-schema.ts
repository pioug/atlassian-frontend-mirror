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
		const items = value.filter((item) => item !== undefined);
		if (items.length === 0) {
			return '[]';
		}
		const inner = items
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

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Emit the TypeScript type annotation for a value, widening all primitive
 * literals to their base types (e.g. `'enum'` → `string`, `100` → `number`).
 *
 * This produces an explicit type annotation on each generated `export const`
 * so that:
 *  1. Running the codegen never silently removes type information.
 *  2. Consumers that use `--isolatedDeclarations` get an explicit declaration
 *     rather than relying on type inference from a deeply-nested literal.
 *
 * For arrays whose elements all share the same structural type, the result is
 * `T[]`.  For heterogeneous arrays (e.g. an extends tuple like
 * `[string, ValidatorSpecNode]` or an anyOf attrs list), the result is
 * `(T1 | T2 | ...)[]`, deduplicating structurally identical element types.
 *
 * The `siblings` argument carries parallel values from sibling array branches
 * at the current path — used to produce a discriminated-union style annotation
 * for object branches that have non-overlapping key sets. When an object
 * branch is missing a key that another sibling branch has, the missing key is
 * emitted as `key?: undefined`. This matches the TypeScript pattern used to
 * make `anyOf`-style attribute unions mutually exclusive (e.g. `media`'s
 * `file` vs `link` attrs, `blockCard`'s three attribute variants).
 */
function serializeValidatorType(value: unknown, depth = 0, siblings: unknown[] = []): string {
	if (value === null) {
		return 'null';
	}
	if (value === undefined) {
		return 'undefined';
	}
	if (typeof value === 'string') {
		return 'string';
	}
	if (typeof value === 'number') {
		return 'number';
	}
	if (typeof value === 'boolean') {
		return 'boolean';
	}
	if (Array.isArray(value)) {
		if (value.length === 0) {
			return 'unknown[]';
		}
		const items = value.filter((item) => item !== undefined);
		if (items.length === 0) {
			return 'unknown[]';
		}
		const elementTypes = items.map((item, i) => {
			const otherElements = items.filter((_, j) => j !== i);
			return serializeValidatorType(item, depth + 1, otherElements);
		});
		const uniqueTypes = [...new Set(elementTypes)];
		const elementType = uniqueTypes.length === 1 ? uniqueTypes[0] : `(${uniqueTypes.join(' | ')})`;
		return `${elementType}[]`;
	}
	if (typeof value === 'object') {
		const selfRecord = value as Record<string, unknown>;
		const siblingObjects = siblings.filter(isPlainObject);
		const ownKeys = Object.keys(selfRecord);
		const allKeys = new Set<string>(ownKeys);
		for (const sibling of siblingObjects) {
			for (const key of Object.keys(sibling)) {
				allKeys.add(key);
			}
		}
		if (allKeys.size === 0) {
			return '{}';
		}
		const sortedKeys = [...allKeys].sort((a, b) => a.localeCompare(b));
		const inner = sortedKeys
			.map((k) => {
				const keyName = /^[a-zA-Z_$][\w$]*$/u.test(k) ? k : JSON.stringify(k);
				if (k in selfRecord) {
					const siblingsForK = siblingObjects.filter((s) => k in s).map((s) => s[k]);
					return `${keyName}: ${serializeValidatorType(selfRecord[k], depth + 1, siblingsForK)}`;
				}
				return `${keyName}?: undefined`;
			})
			.join(`;${indent(depth + 1)}`);
		return `{${indent(depth + 1)}${inner};${indent(depth)}}`;
	}
	throw new Error(`Unsupported value in validator type: ${typeof value}`);
}

function generateValidatorSpec() {
	const output = adfToValidatorSpec(adfNode);
	return Object.entries(output)
		.map(([key, entry]) => {
			const { json } = entry as { json: unknown };
			const type = serializeValidatorType(json);
			return `export const ${key}: ${type} = ${serializeValidatorJson(json)};`;
		})
		.join('\n\n');
}

function main() {
	const spec = generateValidatorSpec();
	writeToFile('validatorSpec.ts', spec, outputPath);
}

main();
