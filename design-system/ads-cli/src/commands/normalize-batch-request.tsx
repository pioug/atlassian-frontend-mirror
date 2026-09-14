/**
 * Normalise one batch child request without involving a shell.
 *
 * The canonical form is already-tokenized argv, for example
 * `['search', 'Grid', '--type', 'component']`. For compatibility with agent-generated commands,
 * the first token may instead contain a complete request, for example `['search Grid', '--type',
 * 'component']`. Only that first token is split; trailing tokens have already been tokenized by the
 * caller and must remain unchanged so multi-word arguments keep their boundaries.
 */

type NormalizedBatchRequest = { argv: string[] } | { error: string };

const shellSyntaxError = (syntax: string): NormalizedBatchRequest => ({
	error: `Shell syntax ${syntax} is not supported in batch requests. Pass child commands as argv only; pipes, redirects, expansion, and command substitution are not allowed.`,
});

/**
 * Reject syntax that would have special meaning to a shell even though this parser never invokes
 * one. Failing closed gives callers an actionable error instead of accepting input that only looks
 * safe because it currently remains an argv array.
 */
const findShellSyntax = (value: string): string | null => {
	if (value.includes('$(')) {
		return 'command substitution (`$(...)`)';
	}
	if (value.includes('`')) {
		return 'command substitution (backticks)';
	}
	if (value.includes('$')) {
		return 'environment expansion (`$`)';
	}
	if (/\r|\n/.test(value)) {
		return 'a command separator (line break)';
	}
	if (value.includes('&&')) {
		return 'the `&&` operator';
	}
	if (value.includes('||')) {
		return 'the `||` operator';
	}

	const operator = value.match(/[|&;<>()]/)?.[0];
	return operator ? `the \`${operator}\` operator` : null;
};

/**
 * Split a complete child request into argv using quoting and escaping rules only. This is
 * intentionally not a shell grammar: it performs no expansion, substitution, redirection, or
 * operator evaluation.
 */
const tokenizeCompleteRequest = (value: string): NormalizedBatchRequest => {
	const argv: string[] = [];
	let current = '';
	let quote: "'" | '"' | null = null;
	let escaped = false;
	let tokenStarted = false;

	for (const character of value) {
		if (escaped) {
			current += character;
			escaped = false;
			tokenStarted = true;
			continue;
		}

		if (character === '\\') {
			escaped = true;
			tokenStarted = true;
			continue;
		}

		if (quote !== null) {
			if (character === quote) {
				quote = null;
			} else {
				current += character;
			}
			continue;
		}

		if (character === "'" || character === '"') {
			quote = character;
			tokenStarted = true;
			continue;
		}

		if (/\s/.test(character)) {
			if (tokenStarted) {
				argv.push(current);
				current = '';
				tokenStarted = false;
			}
			continue;
		}

		current += character;
		tokenStarted = true;
	}

	if (escaped) {
		return { error: 'Invalid complete batch request: it ends with an escape character.' };
	}
	if (quote !== null) {
		return { error: `Invalid complete batch request: unterminated ${quote} quote.` };
	}
	if (tokenStarted) {
		argv.push(current);
	}
	if (argv.length === 0) {
		return { error: 'Invalid complete batch request: a command name is required.' };
	}

	return { argv };
};

export const normalizeBatchRequest = (argv: string[]): NormalizedBatchRequest => {
	for (const token of argv) {
		const syntax = findShellSyntax(token);
		if (syntax !== null) {
			return shellSyntaxError(syntax);
		}
	}

	const [first, ...trailing] = argv;
	if (first === undefined) {
		return { error: '`--command` must be followed by a non-empty command request.' };
	}

	// A normal command name cannot contain whitespace, quotes, or escapes. Their presence in the
	// first argv entry therefore identifies the complete-string compatibility form. Tokenized
	// trailing entries are never re-split.
	if (!/[\s'"\\]/.test(first)) {
		return { argv: [...argv] };
	}

	const normalized = tokenizeCompleteRequest(first);
	if ('error' in normalized) {
		return normalized;
	}

	return { argv: [...normalized.argv, ...trailing] };
};
