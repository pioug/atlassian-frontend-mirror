import type { EventEnricher } from '../types';
import { registerEditorEvents } from './register-editor-events';
import { registerExperienceEvents } from './register-experience-events';
import { registerMediaEvents } from './register-media-events';
import { registerReliabilityEvents } from './register-reliability-events';

export type RegisterFirstInSessionEvent = (enrich: EventEnricher) => void;

/** Creates the enrichers for first-in-session tracking. */
export function createFirstInSessionEnrichers(): readonly EventEnricher[] {
	const enrichers: EventEnricher[] = [];
	const register: RegisterFirstInSessionEvent = (enrich) => {
		enrichers.push(enrich);
	};
	registerEditorEvents(register);
	registerExperienceEvents(register);
	registerMediaEvents(register);
	registerReliabilityEvents(register);
	return enrichers;
}
