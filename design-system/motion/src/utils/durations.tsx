/**
 * Think of this as the motion equivalent of the @atlaskit/theme `grid()`.
 */
export const durationStep = 25;

export type Durations = 'none' | 'small' | 'medium' | 'large';

export const durations: Record<Durations, number> = {
	none: 0,
	small: 100,
	medium: 350,
	large: 700,
};

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
