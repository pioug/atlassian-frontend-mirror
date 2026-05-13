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
