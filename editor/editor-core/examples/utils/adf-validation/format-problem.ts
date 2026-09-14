import type { JsonSyntaxError } from './json-lines';
import { type AdfPath, type LocatedError, pathToLabel } from './validate-adf';

const NODE_JSON_LIMIT = 4000;

const truncate = (text: string, limit: number) =>
	text.length > limit
		? `${text.slice(0, limit)}\n… truncated, ${text.length - limit} more characters`
		: text;

/** `$.content[1].attrs.level`, the shape an LLM is most likely to recognise. */
const toJsonPath = (path: AdfPath) =>
	path.reduce<string>(
		(accumulator, step) =>
			typeof step === 'number' ? `${accumulator}[${step}]` : `${accumulator}.${step}`,
		'$',
	);

const valueAtPath = (root: unknown, path: AdfPath): unknown =>
	path.reduce<unknown>((current, step) => {
		if (current === null || typeof current !== 'object') {
			return undefined;
		}
		return (current as Record<string | number, unknown>)[step];
	}, root);

const isNode = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' &&
	value !== null &&
	typeof (value as Record<string, unknown>).type === 'string';

/**
 * Longest prefix of the path that still points at an ADF node, so an attribute or mark failure is
 * reported together with the node it belongs to.
 */
const enclosingNode = (
	root: unknown,
	path: AdfPath,
): { node: unknown; path: AdfPath } | undefined => {
	for (let end = path.length; end >= 0; end--) {
		const candidate = path.slice(0, end);
		const value = valueAtPath(root, candidate);
		if (isNode(value)) {
			return { node: value, path: candidate };
		}
	}
	return undefined;
};

/**
 * `doc > layoutSection[0] > layoutColumn[0] > paragraph[1]`. Which marks and child types are legal
 * depends on the ancestors, so a report without them is hard to act on.
 */
const nodeTrail = (root: unknown, path: AdfPath): string => {
	const trail: string[] = [];
	if (isNode(root)) {
		trail.push(String(root.type));
	}
	for (let end = 1; end <= path.length; end++) {
		const value = valueAtPath(root, path.slice(0, end));
		const step = path[end - 1];
		if (isNode(value) && typeof step === 'number') {
			// A mark is shaped like a node, so label it by the array it came from.
			trail.push(
				path[end - 2] === 'marks'
					? `marks[${step}]:${String(value.type)}`
					: `${String(value.type)}[${step}]`,
			);
		}
	}
	return trail.join(' > ');
};

const fence = (body: string) => ['```json', body, '```'].join('\n');

/**
 * Everything known about one problem, as markdown, ready to paste into an LLM prompt.
 */
export const formatProblem = (error: LocatedError, doc: unknown): string => {
	const lines: string[] = [
		`# ADF schema problem: ${error.code} (${error.target})`,
		'',
		`- Message: ${error.message}`,
		`- Location: ${pathToLabel(error.path)}`,
		`- JSON path: ${toJsonPath(error.path)}`,
		`- Node trail: ${nodeTrail(doc, error.path)}`,
		`- Reported by: ${
			error.code === 'INVALID_PROPERTY_VALUE'
				? 'this example — @atlaskit/adf-utils/validator does not value-check this prop'
				: '@atlaskit/adf-utils/validator'
		}`,
	];

	if (error.meta) {
		lines.push(`- Validator meta: ${JSON.stringify(error.meta)}`);
	}

	// The provenance note is already covered by "Reported by" above.
	const expectations = error.expectations.filter(
		(expectation) => !expectation.startsWith('reported by this example'),
	);
	if (expectations.length > 0) {
		lines.push('', '## Schema accepts', ...expectations.map((line) => `- ${line}`));
	}

	const offending = valueAtPath(doc, error.path);
	if (offending !== undefined) {
		lines.push('', '## Offending value', fence(JSON.stringify(offending, null, 2)));
	}

	// A mark object is shaped like a node, so start the search above the failing value for anything
	// that is not itself a node.
	const enclosing = enclosingNode(
		doc,
		error.target === 'node' ? error.path : error.path.slice(0, -1),
	);
	if (enclosing && enclosing.path.length !== error.path.length) {
		lines.push(
			'',
			`## Enclosing node (${pathToLabel(enclosing.path)})`,
			fence(truncate(JSON.stringify(enclosing.node, null, 2), NODE_JSON_LIMIT)),
		);
	}

	return lines.join('\n');
};

/**
 * Source excerpt with a caret under the rejected token, which reads well in a prompt.
 */
export const formatSyntaxProblem = (error: JsonSyntaxError, source: string): string => {
	const sourceLines = source.split('\n');
	const from = Math.max(0, error.line - 4);
	const to = Math.min(sourceLines.length, error.line + 3);
	const gutter = String(to).length;

	const excerpt: string[] = [];
	for (let index = from; index < to; index++) {
		const number = String(index + 1).padStart(gutter, ' ');
		const isErrorLine = index + 1 === error.line;
		excerpt.push(`${isErrorLine ? '>' : ' '} ${number} | ${sourceLines[index]}`);
		if (isErrorLine) {
			const pad = ' '.repeat(Math.max(0, error.column - 1));
			excerpt.push(`  ${' '.repeat(gutter)} | ${pad}${'^'.repeat(Math.max(1, error.length))}`);
		}
	}

	const rejected = sourceLines[error.line - 1]?.slice(
		error.column - 1,
		error.column - 1 + error.length,
	);

	return [
		'# ADF JSON syntax error',
		'',
		`- Message: ${error.message}`,
		`- Position: line ${error.line}, column ${error.column} (offset ${error.offset})`,
		`- Rejected token: ${rejected ? `\`${rejected}\`` : 'end of input'}`,
		'',
		'## Source around the failure',
		'```',
		...excerpt,
		'```',
	].join('\n');
};
