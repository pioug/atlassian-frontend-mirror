export const isInvalidInput = (seconds: number): boolean => {
	return isNaN(seconds) || seconds === Infinity || seconds < 0;
};
