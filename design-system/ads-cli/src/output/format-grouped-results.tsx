/**
 * Sectioned compact renderer for grouped (multi-kind) results, e.g. unified `search`.
 *
 * Prints a Components section, then Tokens, then Icons — reusing the per-kind compact renderer
 * for each. Empty groups are skipped, so one command surfaces whatever kinds match, grouped by
 * kind.
 */

import type { RowKind } from '../commands/types';

import { formatCompactResults } from './format-results';

/**
 * Render grouped results as sectioned compact output.
 */
export const formatGroupedResults = ({
	groups,
	totalCount,
}: {
	groups: Record<string, unknown[]>;
	totalCount: number;
}): string => {
	// Fixed display order, with human-friendly section titles.
	const sections: Array<{ kind: RowKind; title: string }> = [
		{ kind: 'components', title: 'Components' },
		{ kind: 'tokens', title: 'Tokens' },
		{ kind: 'icons', title: 'Icons' },
	];

	const blocks: string[] = [`Results (${totalCount}):`];

	for (const { kind, title } of sections) {
		const entries = groups[kind] ?? [];
		if (entries.length === 0) {
			continue;
		}
		// Reuse the single-kind compact renderer with drill-in follow-ups enabled (this is the
		// unified `search` view), then strip its own "Results (n):" header and following blank
		// line so the grouped output uses the section title instead.
		const rendered = formatCompactResults({ kind, data: entries, showFollowUp: true });
		const body = rendered ? rendered.split('\n').slice(2).join('\n') : '';
		blocks.push('', `${title} (${entries.length}):`, '', body);
	}

	return blocks.join('\n');
};
