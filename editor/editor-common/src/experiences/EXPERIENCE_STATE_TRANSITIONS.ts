import type { ExperienceState } from './types';

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
