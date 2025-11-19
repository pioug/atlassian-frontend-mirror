import type { InteractionMetrics } from '../../common';
import type { PageVisibility } from '../../common/react-ufo-payload-schema';
import { getPageVisibilityState } from '../../hidden-timing';

function getPageVisibilityUpToTTAI(interaction: InteractionMetrics): PageVisibility {
	const { start, end } = interaction;
	return getPageVisibilityState(start, end);
}

export default getPageVisibilityUpToTTAI;
