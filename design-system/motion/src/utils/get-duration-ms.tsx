/**
 * Gets the duration in milliseconds for an animation property.
 * @param animation - The animation property to get the duration for.
 * @returns The duration in milliseconds.
 */
export const getDurationMs = (animation: string): { duration: number; delay: number } => {
	const animations = animation
		.split(/,(?![^()]*\))/)
		.map((value) => [...value.trim().matchAll(/(-?\d*\.?\d+)(ms|s)\b/g)])
		.filter((matches) => matches.length > 0);

	if (animations.length === 0) {
		return { duration: 0, delay: 0 };
	}

	return animations.reduce(
		(longest, matches) => {
			const toMilliseconds = (match: RegExpMatchArray): number => {
				const value = parseFloat(match[1]);
				return match[2] === 's' ? value * 1000 : value;
			};
			const timing = {
				duration: toMilliseconds(matches[0]),
				delay: matches[1] ? toMilliseconds(matches[1]) : 0,
			};

			return timing.duration + timing.delay > longest.duration + longest.delay ? timing : longest;
		},
		{ duration: 0, delay: 0 },
	);
};
