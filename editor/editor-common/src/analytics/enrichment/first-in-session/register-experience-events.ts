import { EXPERIENCE_ID } from '../../../experiences/consts';
import { measuredEventByTransitionAttributes } from '../../../experiences/experience-transitions';
import type { ExperienceState } from '../../../experiences/types';
import type { ExperienceEventPayload } from '../../types/experience-events';
import type { EnrichmentEvent } from '../types';
import { classifyEvent } from './classify-event';
import type { RegisterFirstInSessionEvent } from './create-first-in-session-enrichers';
import { enrichFirstInSession, type ClassifyFirstInSession } from './enrich-first-in-session';

const experienceKeys: ReadonlySet<string> = new Set(Object.values(EXPERIENCE_ID));
const experienceStatuses: ReadonlySet<string> = new Set<Exclude<ExperienceState, 'pending'>>([
	'started',
	'aborted',
	'failed',
	'succeeded',
]);

function identifyExperience({ action, attributes }: EnrichmentEvent): string | null {
	const { experienceAction, experienceKey, experienceStatus } = attributes ?? {};
	if (
		action !== 'experienceMeasured' ||
		typeof experienceKey !== 'string' ||
		!experienceKeys.has(experienceKey) ||
		typeof experienceStatus !== 'string' ||
		!experienceStatuses.has(experienceStatus)
	) {
		return null;
	}
	const identity = `${experienceKey}:${experienceStatus}`;
	return typeof experienceAction === 'string' ? `${identity}:${experienceAction}` : identity;
}

const firstInSessionByTransition = new WeakMap<ExperienceEventPayload, boolean | undefined>();

const classify: ClassifyFirstInSession = ({ event, appearance }) => {
	const measuredEvent =
		event.attributes && measuredEventByTransitionAttributes.get(event.attributes);
	if (!measuredEvent) {
		return classifyEvent(event, appearance, identifyExperience);
	}
	// Measured and sampled copies share the decision for the same transition.
	if (firstInSessionByTransition.has(measuredEvent)) {
		return firstInSessionByTransition.get(measuredEvent);
	}
	const result = classifyEvent(measuredEvent, appearance, identifyExperience);
	firstInSessionByTransition.set(measuredEvent, result);
	return result;
};

/** Enriches measured and sampled experience events. */
export function registerExperienceEvents(register: RegisterFirstInSessionEvent): void {
	register((options) => {
		const { action, actionSubject, eventType } = options.event;
		if (
			actionSubject === 'editor' &&
			eventType === 'operational' &&
			(action === 'experienceMeasured' || action === 'experienceSampled')
		) {
			return enrichFirstInSession(options, classify);
		}
	});
}
