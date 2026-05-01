export const convertToMs = (duration: string): number => {
	// Use regex to separate the number and the unit
	const matches = duration.match(/^(\d+\.?\d*)(s|ms)$/);

	if (!matches) return 0; // Or return for invalid format

	const value = parseFloat(matches[1]);
	const unit = matches[2];

	if (unit === 's') {
		return value * 1000; // Convert seconds to milliseconds
	} else {
		return value; // Already in milliseconds
	}
};
