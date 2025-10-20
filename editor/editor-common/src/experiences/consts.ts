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
	DOM_MUTATION_TARGET_NOT_FOUND: 'dom-mutation-target-not-found',

	/**
	 * Error occurred during DOM mutation check execution
	 */
	DOM_MUTATION_CHECK_ERROR: 'dom-mutation-check-error',
} as const;
