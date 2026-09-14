import { findJsonSyntaxError } from './json-syntax';
import { type AdfPath, pathToKey } from './validate-adf';

export type JsonLine = {
	/** Nesting depth, already baked into `text` as leading spaces. */
	depth: number;
	/** True for the line that opens the value (`"key": {`, `"key": 1`). */
	isOpening: boolean;
	path: AdfPath;
	pathKey: string;
	text: string;
};

const INDENT = '  ';

/**
 * Pretty prints JSON one line at a time, tagging every line with the path of the value it belongs
 * to. That tag is what lets the UI highlight the exact lines a validation error points at.
 */
export const toJsonLines = (value: unknown): JsonLine[] => {
	const lines: JsonLine[] = [];

	const push = (depth: number, path: AdfPath, text: string, isOpening: boolean) => {
		lines.push({
			depth,
			path,
			pathKey: pathToKey(path),
			text: INDENT.repeat(depth) + text,
			isOpening,
		});
	};

	const walk = (current: unknown, path: AdfPath, prefix: string, depth: number, comma: string) => {
		if (Array.isArray(current)) {
			if (current.length === 0) {
				push(depth, path, `${prefix}[]${comma}`, true);
				return;
			}
			push(depth, path, `${prefix}[`, true);
			current.forEach((item, index) => {
				walk(item, [...path, index], '', depth + 1, index === current.length - 1 ? '' : ',');
			});
			push(depth, path, `]${comma}`, false);
			return;
		}

		if (typeof current === 'object' && current !== null) {
			const keys = Object.keys(current);
			if (keys.length === 0) {
				push(depth, path, `${prefix}{}${comma}`, true);
				return;
			}
			push(depth, path, `${prefix}{`, true);
			keys.forEach((key, index) => {
				walk(
					(current as Record<string, unknown>)[key],
					[...path, key],
					`"${key}": `,
					depth + 1,
					index === keys.length - 1 ? '' : ',',
				);
			});
			push(depth, path, `}${comma}`, false);
			return;
		}

		push(depth, path, `${prefix}${JSON.stringify(current) ?? 'undefined'}${comma}`, true);
	};

	walk(value, [], '', 0, '');

	return lines;
};

/**
 * Where a `JSON.parse` failure sits in the source, as a highlightable range.
 */
export type JsonSyntaxError = {
	column: number;
	length: number;
	line: number;
	message: string;
	offset: number;
};

export const describeJsonSyntaxError = (source: string, error: unknown): JsonSyntaxError => {
	const failure = findJsonSyntaxError(source);
	const raw = error instanceof Error ? error.message : String(error);
	// The scanner always finds the failure `JSON.parse` hit; fall back to its message just in case.
	const offset = failure
		? failure.offset
		: Math.min(Number(/position (\d+)/u.exec(raw)?.[1] ?? source.length), source.length);
	const message =
		failure?.message ??
		raw.replace(/\s*in JSON at position \d+(\s*\(line \d+ column \d+\))?/u, '').trim();
	const linesBefore = source.slice(0, offset).split('\n');

	return {
		offset,
		message,
		length: failure?.length ?? 1,
		line: linesBefore.length,
		column: linesBefore[linesBefore.length - 1].length + 1,
	};
};

export type SourceLine = {
	/** Text after the offending token. */
	after: string;
	/** Text before the offending token. */
	before: string;
	isError: boolean;
	number: number;
	/** The rejected token, empty when the failure is at the end of the input. */
	offending: string;
};

/**
 * Splits the raw source into lines, marking the range the parser rejected so it can be highlighted
 * in place rather than described in prose.
 */
export const toSourceLines = (source: string, error: JsonSyntaxError): SourceLine[] =>
	source.split('\n').map((text, index) => {
		const number = index + 1;
		if (number !== error.line) {
			return { number, before: text, offending: '', after: '', isError: false };
		}
		const from = Math.max(0, Math.min(error.column - 1, text.length));
		const to = Math.min(from + error.length, text.length);
		return {
			number,
			before: text.slice(0, from),
			offending: text.slice(from, to),
			after: text.slice(to),
			isError: true,
		};
	});
