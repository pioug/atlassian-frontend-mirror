/**
 * Calculates the 90th percentile value from an array of step sizes.
 * @param stepSizeSumFor90 - An array of step sizes to calculate the 90th percentile value.
 * @returns
 */
export const calculateP90Value = (stepSizeSumFor90?: number[]) => {
	if (!stepSizeSumFor90 || stepSizeSumFor90?.length === 0) {
		return 0;
	}

	const sortedSteps = stepSizeSumFor90.sort((a, b) => a - b);
	const p90Index = Math.ceil(0.9 * sortedSteps.length) - 1;

	return sortedSteps[p90Index] || 0;
};
