import { EXPERIENCE_STATE_TRANSITIONS } from './EXPERIENCE_STATE_TRANSITIONS';
import type { ExperienceState } from './types';

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
