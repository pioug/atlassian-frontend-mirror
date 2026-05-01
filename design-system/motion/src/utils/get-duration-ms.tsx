/**
 * Gets the duration in milliseconds for an animation property.
 * @param animation - The animation property to get the duration for.
 * @returns The duration in milliseconds.
 */
export const getDurationMs = (animation: string): { duration: number; delay: number } => {
	const match = [...animation.trim().matchAll(/(-?\d*\.?\d+)(ms|s)\b/g)];
	if (match.length === 0) {
		return { duration: 0, delay: 0 };
	}
	const durationValue = parseFloat(match[0][1]);
	const durationUnit = match[0][2];
	const duration = durationUnit === 's' ? durationValue * 1000 : durationValue;

	let delay = 0;
	if (match[1]) {
		const delayValue = parseFloat(match[1][1]);
		const delayUnit = match[1][2];
		delay = delayUnit === 's' ? delayValue * 1000 : delayValue;
	}

	return {
		duration,
		delay,
	};
};
