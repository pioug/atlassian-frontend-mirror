import { convertToMs } from './convert-to-ms';

const cssTimePattern = /^-?(?:\d+\.?\d*|\.\d+)(?:ms|s)$/;

const toCssList = (value: string): string[] =>
	value
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean);

const toTimeList = (value: string): number[] =>
	toCssList(value)
		.filter((time) => cssTimePattern.test(time))
		.map(convertToMs);

/**
 * Returns the longest total runtime from computed CSS animation name, duration, and delay lists.
 * `animation-name` determines the number of animations. CSS repeats shorter duration and delay
 * lists and ignores timing values that do not correspond to an animation name.
 */
export const getComputedAnimationDurationMs = (
	animationName: string,
	animationDuration: string,
	animationDelay: string,
): number => {
	const names = toCssList(animationName);
	const durations = toTimeList(animationDuration);
	const delays = toTimeList(animationDelay);

	if (names.length === 0 || durations.length === 0) {
		return 0;
	}

	let longestDuration = 0;

	for (let index = 0; index < names.length; index++) {
		if (names[index] === 'none') {
			continue;
		}

		const duration = durations[index % durations.length];
		const delay = delays.length > 0 ? delays[index % delays.length] : 0;
		longestDuration = Math.max(longestDuration, duration + delay);
	}

	return longestDuration;
};
