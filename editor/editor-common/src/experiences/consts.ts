/**
 * Built-in failure reasons for experience checks
 *
 * These are used by the various ExperienceCheck implementations to
 * provide consistent, well-known failure reasons for analytics and debugging.
 */
export const EXPERIENCE_FAILURE_REASON = {
	/**
	 * Experience timed out before completion
	 */
	TIMEOUT: 'timeout',

	/**
	 * Target element could not be found when starting DOM mutation observation
	 */
	DOM_MUTATION_TARGET_NOT_FOUND: 'domMutationTargetNotFound',

	/**
	 * Error occurred during DOM mutation check execution
	 */
	DOM_MUTATION_CHECK_ERROR: 'domMutationCheckError',
} as const;

/**
 * Built-in abort reasons for experiences.
 *
 * These may be used by various ExperienceCheck implementations to
 * provide consistent, well-known abort reasons for analytics and debugging.
 */
export const EXPERIENCE_ABORT_REASON = {
	/**
	 * Experience was aborted because it was restarted while already in progress
	 */
	RESTARTED: 'restarted',
} as const;

/**
 * Default sample rate for experienceSampled events.
 * Set to 1 in 1000 (0.001) to balance data collection with event volume.
 *
 * Newly defined experiences should use this default unless they have data
 * to justify a different rate.
 *
 * The expectation is that measurements will be gathered after initial
 * instrumentation, then the sample rate can be tuned up to a safe threshold.
 */
export const DEFAULT_EXPERIENCE_SAMPLE_RATE = 0.001;

export const EXPERIENCE_ID = {
	ASYNC_OPERATION: 'asyncOperation',
	MENU_ACTION: 'menuAction',
	MENU_OPEN: 'menuOpen',
	TOOLBAR_ACTION: 'toolbarAction',
	TOOLBAR_OPEN: 'toolbarOpen',
} as const;
