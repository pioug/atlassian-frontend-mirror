import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';

export type INSMOptions = {
	/**
	 * If an experience is missing or not enabled - no session event will be fired
	 */
	experiences: { [key: string]: { enabled: boolean } | undefined };
	getAnalyticsWebClient: Promise<AnalyticsWebClient>;
};

export type ExperienceProperties = {
	/**
	 * An optional content id (ie. for a Confluence page - the page id)
	 *
	 * Leaf experiences such as the Confluence Space Overview are
	 * not expected to provide this property.
	 */
	contentId?: string | null;
	/**
	 * Whether this represents the initial page the user is visiting
	 */
	initial: boolean;
};

export type AddedProperties =
	| { [key: string]: string | number | boolean | undefined }
	| (() => { [key: string]: string | number | boolean | undefined });

export type Measure = {
	average: number;
	denominator: number;
	max: number;
	min: number;
	numerator: number;
};

export interface PeriodMeasurer {
	/**
	 * Run any cleanup, and report the last periods interactivity.
	 *
	 * Important note: A new period can start after the end has been reached
	 * in cases where the measurement was ended due to a scenario such as an
	 * error boundary being hit (via `insm.stopEarly`).
	 */
	end: () => Measure;
	/**
	 * Name of the interactivity measurement (measures in the resulting insm event will be under this key)
	 */
	name: string;

	/**
	 * Pauses measurement (ie. when heavy work is triggered)
	 */
	pause: () => void;

	/**
	 * Pauses measurement (ie. when heavy work completes)
	 */
	resume: () => void;
	// Thoughts -- In future we may want to have the active period end logic lead to an active
	// period close earlier than the active period end confirmation.
	// ie.
	// - active period ends 2 seconds after last user activity
	// - active period end confirmed after 4 seconds of no user activity (so we need to split the
	// - "waiting period" to not include the final 2 seconds worth of data).
	// For now we have a simpler implementation where active period logic uses an aggressive end
	// logic (3 seconds + 3 animation frames)
	/**
	 * Called when an the state changes, and/or a new experience session starts.
	 *
	 * Implementers should take care to handle if measurements can be received after
	 * an animation frame.  In this scenario, on resetting - the consumer needs to
	 * discard any measurements started before the reset.
	 *
	 * The possibility of data loss due to this is mitigated by the inactive period logic
	 * where a session can not be marked as inactive until
	 * - at least 3 seconds of no user activity
	 * - and 2 animation frames since the last user activity.
	 *
	 * **Important** consumers need to handle starting up both initial tracking and also
	 * when tracking is restarted after an end.
	 *
	 * @returns The interactivity measurements for the current period (or undefined for the initial start)
	 */
	start: (
		/**
		 * When started with paused = true. it indicates a heavy task is running at startup time.
		 */
		paused: boolean,
	) => Measure | undefined;
}
