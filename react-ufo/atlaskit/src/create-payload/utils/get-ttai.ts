import type { InteractionMetrics } from '../../common';

import getPageVisibilityUpToTTAI from './get-page-visibility-up-to-ttai';

export default function getTTAI(interaction: InteractionMetrics): number | undefined {
	const { start, end } = interaction;
	const pageVisibilityUpToTTAI = getPageVisibilityUpToTTAI(interaction);
	return !interaction.abortReason && pageVisibilityUpToTTAI === 'visible'
		? Math.round(end - start)
		: undefined;
}
