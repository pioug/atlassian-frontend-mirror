import type { CustomExperienceMetadata, ExperienceState } from '../../experiences/types';

import type { ACTION, ACTION_SUBJECT } from './enums';
import type { OperationalAEP } from './utils';

/**
 * Experience event attributes for tracking experience state transitions.
 */
export type ExperienceEventAttributes = CustomExperienceMetadata & {
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
	experienceStatusFirstSeen: boolean;

	/**
	 * Timestamp when the experience started.
	 *
	 * Milliseconds since epoch.
	 */
	experienceStartTime: number;

	/**
	 * Duration from experience start to current status transition.
	 *
	 * Measured in milliseconds.
	 */
	experienceDuration: number;

	/**
	 * Optional method for experience start, e.g., how the experience was initiated.
	 */
	experienceStartMethod?: string;

	/**
	 * Optional reason for experience end, e.g., abort or failure reason.
	 */
	experienceEndReason?: string;

	/**
	 * Optional action that triggered the experience, if applicable.
	 */
	experienceAction?: string;
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
