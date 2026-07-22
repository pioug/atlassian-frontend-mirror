/**
 * Shared shape and type guard for an "ambiguous lookup" result.
 *
 * When an item command (`component`/`token`/`icon`) is given a name that fuzzy-matches multiple
 * entries and none is an exact name match, the command's `transform` produces one of these
 * instead of a single detail object. Both the human renderer and the `--json` envelope then
 * present a "did you mean?" candidate list rather than silently picking the top fuzzy hit.
 */

/**
 * A candidate surfaced in a disambiguation result.
 */
export type DisambiguationCandidate = {
	/**
	 * The display name of the candidate (e.g. `ButtonGroup`, `space.100`, `AddIcon`).
	 */
	name: string;
	/**
	 * Optional secondary detail shown after the name (e.g. the package or example value).
	 */
	hint?: string;
	/**
	 * The follow-up command that drills into this exact candidate, e.g. `component ButtonGroup`.
	 */
	followUp: string;
};

/**
 * The marker object a `transform` returns when a lookup is ambiguous.
 */
export type DisambiguationResult = {
	/**
	 * Discriminator so both the type guard and JSON consumers can detect the ambiguous case.
	 */
	ambiguous: true;
	/**
	 * The term the user searched for.
	 */
	query: string;
	/**
	 * The command noun (`component`/`token`/`icon`) — used in the prompt copy.
	 */
	noun: string;
	/**
	 * The ranked candidates the user can choose from.
	 */
	candidates: DisambiguationCandidate[];
};

/**
 * Narrow an unknown value to a {@link DisambiguationResult}.
 */
export const isDisambiguation = (value: unknown): value is DisambiguationResult =>
	typeof value === 'object' &&
	value !== null &&
	(value as { ambiguous?: unknown }).ambiguous === true;
