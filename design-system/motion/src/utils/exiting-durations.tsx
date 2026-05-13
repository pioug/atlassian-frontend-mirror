import { durations, type Durations } from './durations';

/**
 * Used to multiply the initial duration for exiting motions.
 */
const EXITING_MOTION_MULTIPLIER = 0.5;

export const exitingDurations: Record<Durations, number> = {
	none: durations.none,
	small: durations.small * EXITING_MOTION_MULTIPLIER,
	medium: durations.medium * EXITING_MOTION_MULTIPLIER,
	large: durations.large * EXITING_MOTION_MULTIPLIER,
};
