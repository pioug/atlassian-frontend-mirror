/**
 * Human-readable renderer for an ambiguous item lookup ("did you mean?").
 */

import type { DisambiguationResult } from './disambiguation';

/**
 * Render a "did you mean?" list for an ambiguous lookup.
 *
 * Mirrors the compact search rows (name, optional hint, and a `→ <follow-up>` command) so the
 * output is consistent with `search`, and tells the user how to disambiguate.
 */
export const formatDisambiguation = ({ query, noun, candidates }: DisambiguationResult): string => {
	const header = `Multiple ${noun}s match "${query}". Did you mean one of these?`;

	const rows = candidates.map((candidate) => {
		const hint = candidate.hint ? `  ${candidate.hint}` : '';
		return `  ${candidate.name}${hint}\n      → ads-cli ${candidate.followUp}`;
	});

	return [header, '', ...rows].join('\n');
};
