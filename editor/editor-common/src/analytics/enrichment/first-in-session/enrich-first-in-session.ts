import type { EventEnrichmentOptions } from '../types';

export type ClassifyFirstInSession = (options: EventEnrichmentOptions) => boolean | undefined;

const firstOccurrence = { firstInSession: true } as const;
const repeatOccurrence = { firstInSession: false } as const;

/** Adds the first or repeat marker once per emitted event. */
export function enrichFirstInSession(
	options: EventEnrichmentOptions,
	classify: ClassifyFirstInSession,
): Readonly<{ firstInSession: boolean }> | undefined {
	if (typeof options.event.attributes?.firstInSession === 'boolean') {
		return;
	}
	const firstInSession = classify(options);
	if (firstInSession === undefined) {
		return;
	}
	return firstInSession ? firstOccurrence : repeatOccurrence;
}
