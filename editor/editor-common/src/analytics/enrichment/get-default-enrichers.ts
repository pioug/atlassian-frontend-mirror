import { createFirstInSessionEnrichers } from './first-in-session/create-first-in-session-enrichers';
import type { EventEnricher } from './types';

/** Collects the default enrichers for the analytics boundary. */
export function getDefaultEnrichers(): readonly EventEnricher[] {
	return createFirstInSessionEnrichers();
}
