/**
 * A random sampling function
 * sampling algorithm is from @atlassian/jira-coinflip at https://stash.atlassian.com/projects/JIRACLOUD/repos/jira-frontend/browse/src/packages/platform/app-framework/coinflip/src/index.tsx
 * E.g. isExperienceSampled(2) will pass 50% of the time
 * @param rate The chance that it will pass (1 in <rate> times)
 * @returns bool, if it passes or not
 */
// default sampling function to determine which one to be sampled
export const isExperienceSampled = (rate: number): boolean => {
	if (rate === 1) {
		return true;
	}
	if (rate === 0) {
		return false;
	}
	return Math.random() * rate <= 1;
};
