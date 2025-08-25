const activeGuidelineStyle = <T extends { active?: boolean; show?: boolean }>(guideline: T) => ({
	...guideline,
	active: true,
	show: true,
});

export const getGuidelinesWithHighlights = <
	T extends { active?: boolean; key: string; show?: boolean },
>(
	gap: number,
	maxGap: number,
	activeGuidelineKeys: string[],
	guidelines: T[],
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
