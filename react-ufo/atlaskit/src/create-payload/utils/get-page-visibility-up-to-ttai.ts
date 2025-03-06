import type { InteractionMetrics } from '../../common';
import { getPageVisibilityState } from '../../hidden-timing';

export default function getPageVisibilityUpToTTAI(interaction: InteractionMetrics) {
	const { start, end } = interaction;
	return getPageVisibilityState(start, end);
}
