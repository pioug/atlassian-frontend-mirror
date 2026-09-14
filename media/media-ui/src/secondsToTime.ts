import { isInvalidInput } from './isInvalidInput';

export const secondsToTime = (
	seconds: number,
): { seconds: number; minutes: number; hours: number } => {
	if (isInvalidInput(seconds)) {
		return { seconds: 0, minutes: 0, hours: 0 };
	}

	const totalSeconds = parseInt(`${seconds}`, 10);
	const hours = Math.floor(totalSeconds / 3600);

	let remainingSeconds = totalSeconds % 3600;
	const minutes = Math.floor(remainingSeconds / 60);
	remainingSeconds %= 60;

	return {
		seconds: remainingSeconds,
		minutes,
		hours,
	};
};
