export const getNormalizedProgress = (progress?: number): number => {
	return Math.min(1, Math.max(0, progress || 0)) * 100;
};
