/**
 * Compact, human-readable renderers for the structured search/list results.
 *
 * The underlying ADS MCP tools return rich JSON arrays. Dumping that raw is unreadable at a
 * terminal, so the default (non-`--json`) output renders a compact one line per result. Full
 * structured data remains available via `--json`.
 *
 * Anything this module does not recognise (e.g. guideline markdown, the `plan` payload) is
 * left to the caller's generic fallback.
 */

import type { RowKind } from '../commands/types';

/**
 * A component result as returned by `searchComponentsTool` / `getAllComponentsTool`.
 * Only the fields the compact view needs are modelled; others are ignored.
 */
type ComponentResult = {
	name?: string;
	package?: string;
	props?: unknown[];
	examples?: unknown[];
};

/**
 * A token result as returned by `searchTokensTool` / `getAllTokensTool`.
 */
type TokenResult = {
	name?: string;
	exampleValue?: string;
};

/**
 * An icon result as returned by `searchIconsTool` / `getAllIconsTool`.
 */
type IconResult = {
	componentName?: string;
	package?: string;
	usage?: string;
};

/**
 * Count helper that is safe against non-array / missing fields.
 */
const countOf = (value: unknown): number => (Array.isArray(value) ? value.length : 0);

/**
 * Pluralise a `count`-prefixed noun, e.g. `1 prop` / `2 props`.
 */
const pluralize = (count: number, noun: string): string =>
	`${count} ${noun}${count === 1 ? '' : 's'}`;

/**
 * Truncate a one-line description so compact rows stay on a single line.
 */
const truncate = (text: string, max = 80): string =>
	text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;

/**
 * Append a `→ ads-cli <command> <name>` drill-in hint beneath a row.
 *
 * Only used in unified `search`, where a row is one of many mixed results and the natural next
 * step is to view that one in full. Single-kind listings (`--all`, `--type`) omit it — you asked
 * for the whole list, so echoing each row's own name back would just be noise.
 */
const withFollowUp = ({
	line,
	command,
	name,
	showFollowUp,
}: {
	line: string;
	command: string;
	name: string;
	showFollowUp: boolean;
}): string => (showFollowUp ? `${line}\n    → ads-cli ${command} ${name}` : line);

/**
 * Render one component as a compact line.
 *
 * No `[kind]` tag is added: every caller renders a single kind at a time — a single-kind command
 * (`--all`, `--type`) or a titled section of grouped `search` — so the kind is always clear from
 * context and a tag would just be noise.
 */
const formatComponentLine = (component: ComponentResult, showFollowUp: boolean): string => {
	const name = component.name ?? '(unknown)';
	const pkg = component.package ? `  ${component.package}` : '';
	const propCount = countOf(component.props);
	const exampleCount = countOf(component.examples);
	const meta = [pluralize(propCount, 'prop'), pluralize(exampleCount, 'example')].join(', ');
	return withFollowUp({
		line: `${name}${pkg}  (${meta})`,
		command: 'component',
		name,
		showFollowUp,
	});
};

/**
 * Render one token as a compact `name = value` line.
 */
const formatTokenLine = (tokenResult: TokenResult, showFollowUp: boolean): string => {
	const name = tokenResult.name ?? '(unknown)';
	// Some token values (e.g. motion easing curves) are very long; truncate so each token stays
	// on a single readable line. The full value is always available via `--json`.
	const line = tokenResult.exampleValue ? `${name} = ${truncate(tokenResult.exampleValue)}` : name;
	return withFollowUp({ line, command: 'token', name, showFollowUp });
};

/**
 * Render one icon as a compact line with its import package and short usage note.
 */
const formatIconLine = (iconResult: IconResult, showFollowUp: boolean): string => {
	const name = iconResult.componentName ?? '(unknown)';
	const pkg = iconResult.package ? `  ${iconResult.package}` : '';
	const usage = iconResult.usage ? `  — ${truncate(iconResult.usage)}` : '';
	return withFollowUp({ line: `${name}${pkg}${usage}`, command: 'icon', name, showFollowUp });
};

/**
 * Render an array of results as compact lines for the given kind. Returns `null` when the data
 * is not an array (so the caller can fall back to generic JSON rendering).
 *
 * `showFollowUp` (default `false`) adds a `→ ads-cli <command> <name>` drill-in hint beneath each
 * row. It is enabled only by unified `search`; single-kind listings (`--all`, `--type`) leave it
 * off so the output stays terse.
 */
export const formatCompactResults = ({
	kind,
	data,
	showFollowUp = false,
}: {
	kind: RowKind;
	data: unknown;
	showFollowUp?: boolean;
}): string | null => {
	if (!Array.isArray(data)) {
		return null;
	}

	if (data.length === 0) {
		return 'No results.';
	}

	const lines = data.map((entry) => {
		switch (kind) {
			case 'components':
				return formatComponentLine(entry as ComponentResult, showFollowUp);
			case 'tokens':
				return formatTokenLine(entry as TokenResult, showFollowUp);
			case 'icons':
				return formatIconLine(entry as IconResult, showFollowUp);
			default:
				return JSON.stringify(entry);
		}
	});

	const header = `Results (${data.length}):`;
	return [header, '', ...lines].join('\n');
};
