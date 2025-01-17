const activeGuidelineStyle = <T extends { active?: boolean; show?: boolean }>(guideline: T) => ({
	...guideline,
	active: true,
	show: true,
});

export const getGuidelinesWithHighlights = <
	T extends { key: string; active?: boolean; show?: boolean },
>(
	gap: number,
	maxGap: number,
	activeGuidelineKeys: string[],
	guidelines: T[],
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
): T[] => {
	if (activeGuidelineKeys.length) {
		return guidelines.map((guideline) => {
			if (activeGuidelineKeys.includes(guideline.key) && gap < maxGap) {
				return activeGuidelineStyle(guideline);
			}
			return guideline;
		});
	} else {
		return guidelines;
	}
};
