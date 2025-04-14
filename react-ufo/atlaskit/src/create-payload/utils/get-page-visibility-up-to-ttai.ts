import type { InteractionMetrics } from '../../common';
import { getPageVisibilityState } from '../../hidden-timing';
import { withProfiling } from '../../self-measurements';

const getPageVisibilityUpToTTAI = withProfiling(function getPageVisibilityUpToTTAI(
	interaction: InteractionMetrics,
) {
	const { start, end } = interaction;
	return getPageVisibilityState(start, end);
});

export default getPageVisibilityUpToTTAI;
