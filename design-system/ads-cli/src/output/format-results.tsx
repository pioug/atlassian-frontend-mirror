/**
 * Compact, human-readable renderers for the structured search/list results.
 *
 * The underlying ADS MCP tools return rich JSON arrays. Search and list commands first project
 * those arrays into shared compact records, then both human and `--json` output consume the same
 * data. Exact detail commands retain the full structured payload.
 *
 * Anything this module does not recognise (e.g. guideline markdown, the `plan` payload) is
 * left to the caller's generic fallback.
 */

import { humanFormat } from '@atlaskit/cli-output/human-format';

import { CLI_BIN_NAME } from '../commands/cli-metadata';
import type { RowKind } from '../commands/types';

import {
	type CompactComponentResult,
	type CompactDocResult,
	type CompactIconResult,
	compactResults,
	type CompactTokenResult,
} from './compact-results';

/**
 * Pluralise a `count`-prefixed noun, e.g. `1 prop` / `2 props`.
 */
const pluralize = (count: number, noun: string): string =>
	`${count} ${noun}${count === 1 ? '' : 's'}`;

/**
 * Render one component as a compact line.
 *
 * No `[kind]` tag is added: every caller renders a single kind at a time — a single-kind command
 * (`--all`, `--type`) or a titled section of grouped `search` — so the kind is always clear from
 * context and a tag would just be noise.
 */
const formatComponentLine = (component: CompactComponentResult, invocation: string): string => {
	return humanFormat.searchRow({
		name: component.name,
		package: component.package,
		source: 'ads',
		kind: 'component',
		metadata: [
			pluralize(component.propCount, 'prop'),
			pluralize(component.exampleCount, 'example'),
		],
		followUp: component.followUp ? `${invocation} ${component.followUp}` : undefined,
	});
};

/**
 * Render one token as a compact `name = value` line.
 */
const formatTokenLine = (tokenResult: CompactTokenResult, invocation: string): string => {
	return humanFormat.searchRow({
		name: tokenResult.name,
		source: 'ads',
		kind: 'token',
		metadata: tokenResult.exampleValue ? [`= ${tokenResult.exampleValue}`] : undefined,
		followUp: tokenResult.followUp ? `${invocation} ${tokenResult.followUp}` : undefined,
	});
};

/**
 * Render one icon as a compact line with its import package and short usage note.
 */
const formatIconLine = (iconResult: CompactIconResult, invocation: string): string => {
	return humanFormat.searchRow({
		name: iconResult.componentName,
		package: iconResult.package,
		source: 'ads',
		kind: 'icon',
		metadata: iconResult.usage ? [iconResult.usage] : undefined,
		followUp: iconResult.followUp ? `${invocation} ${iconResult.followUp}` : undefined,
	});
};

/**
 * Render one foundations-document match without dumping its full Markdown body.
 */
const formatDocLine = (doc: CompactDocResult, invocation: string): string => {
	return humanFormat.searchRow({
		name: doc.title,
		source: 'ads',
		kind: 'docs',
		description: doc.summary,
		followUp: doc.followUp ? `${invocation} ${doc.followUp}` : undefined,
	});
};

/**
 * Render an array of results as compact lines for the given kind. Returns `null` when the data
 * is not an array (so the caller can fall back to generic JSON rendering).
 *
 * `showFollowUp` (default `false`) adds a `→ <invocation> <command> <name>` drill-in hint beneath
 * each row. Search enables it for both grouped and `--type` output; `--all` listings leave it off.
 */
export const formatCompactResults = ({
	kind,
	data,
	showFollowUp = false,
	invocation = CLI_BIN_NAME,
}: {
	kind: RowKind;
	data: unknown;
	showFollowUp?: boolean;
	invocation?: string;
}): string | null => {
	const compact = compactResults({ kind, data, showFollowUp });
	if (compact === null) {
		return null;
	}

	if (compact.length === 0) {
		return 'No results.';
	}

	const lines = compact.map((entry) => {
		switch (kind) {
			case 'components':
				return formatComponentLine(entry as CompactComponentResult, invocation);
			case 'tokens':
				return formatTokenLine(entry as CompactTokenResult, invocation);
			case 'icons':
				return formatIconLine(entry as CompactIconResult, invocation);
			case 'docs':
				return formatDocLine(entry as CompactDocResult, invocation);
			default:
				return JSON.stringify(entry);
		}
	});

	const header = `Results (${compact.length}):`;
	return [header, '', ...lines].join('\n');
};
