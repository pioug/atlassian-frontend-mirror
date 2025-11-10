import type { ExperienceState } from '../../experiences/experience-state';

import type { ACTION, ACTION_SUBJECT } from './enums';
import type { OperationalAEP } from './utils';

/**
 * Experience event attributes for tracking experience state transitions.
 */
type ExperienceEventAttributes = {
	// Allow any additional custom metadata
	[key: string]: unknown;

	/**
	 * The unique key identifying the experience being tracked.
	 */
	experienceKey: string;

	/**
	 * The state the experience transitioned to.
	 */
	experienceStatus: ExperienceState;

	/**
	 * Whether this is the first transition to this status for this experience
	 * in the current editor session.
	 */
	firstInSession: boolean;
};

/**
 * Event fired on every successful experience state transition.
 * Used for data analysis in Databricks.
 */
type ExperienceMeasuredAEP = OperationalAEP<
	ACTION.EXPERIENCE_MEASURED,
	ACTION_SUBJECT.EDITOR,
	undefined,
	ExperienceEventAttributes
>;

/**
 * Event fired on sampled experience state transitions (e.g., 1 in 1000).
 * Can be forwarded to Signal FX, Statsig, etc. for use in SLOs and defining experiment metrics.
 */
type ExperienceSampledAEP = OperationalAEP<
	ACTION.EXPERIENCE_SAMPLED,
	ACTION_SUBJECT.EDITOR,
	undefined,
	ExperienceEventAttributes
>;

export type ExperienceEventPayload = ExperienceMeasuredAEP | ExperienceSampledAEP;
