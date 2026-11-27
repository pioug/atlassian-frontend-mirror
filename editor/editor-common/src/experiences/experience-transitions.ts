import type { ExperienceEventPayload } from '../analytics/types/experience-events';

// Dispatch preserves the attributes objects so consumers can correlate both events from one transition.
export const measuredEventByTransitionAttributes: WeakMap<object, ExperienceEventPayload> =
	new WeakMap();
