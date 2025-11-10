/**
 * Represents the state of an experience throughout its lifecycle.
 */
export type ExperienceState = 'pending' | 'started' | 'aborted' | 'failed' | 'succeeded';

/**
 * State transition map defining valid state transitions.
 */
export const EXPERIENCE_STATE_TRANSITIONS: Record<ExperienceState, ExperienceState[]> = {
	pending: ['started'],
	started: ['aborted', 'failed', 'succeeded'],
	aborted: ['started'],
	failed: ['started'],
	succeeded: ['started'],
};

/**
 * Validates whether a state transition is allowed.
 *
 * @param fromState - The current state
 * @param toState - The target state to transition to
 * @returns true if the transition is valid, false otherwise
 */
export const canTransition = (fromState: ExperienceState, toState: ExperienceState): boolean => {
	return EXPERIENCE_STATE_TRANSITIONS[fromState]?.includes(toState) ?? false;
};
