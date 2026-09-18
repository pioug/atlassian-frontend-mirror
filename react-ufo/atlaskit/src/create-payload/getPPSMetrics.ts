import { fg } from '@atlaskit/platform-feature-flags/fg';

import { getLighthouseMetrics } from '../additional-payload/utils/lighthouse-metrics/getLighthouseMetrics';
import type { InteractionMetrics } from '../common';
import { getConfig } from '../config';
import getInteractionStatus from './utils/get-interaction-status';
import getPageVisibilityUpToTTAI from './utils/get-page-visibility-up-to-ttai';

export function getPPSMetrics(interaction: InteractionMetrics): any {
	const { start, end } = interaction;
	const config = getConfig();
	const interactionStatus = getInteractionStatus(interaction);
	const pageVisibilityUpToTTAI = getPageVisibilityUpToTTAI(interaction);
	const tti = interaction.apdex?.[0]?.stopTime;
	const ttai =
		interactionStatus.originalInteractionStatus === 'SUCCEEDED' &&
		pageVisibilityUpToTTAI === 'visible'
			? Math.round(end - start)
			: undefined;

	const PPSMetricsAtTTI = tti !== undefined ? getLighthouseMetrics({ start, stop: tti }) : null;
	const PPSMetricsAtTTAI =
		ttai !== undefined
			? getLighthouseMetrics({
					start,
					stop: interaction.end,
				})
			: null;

	if (fg('platform_ufo_remove_deprecated_config_fields')) {
		if (PPSMetricsAtTTAI !== null) {
			return PPSMetricsAtTTAI;
		}
	} else {
		if (config?.shouldCalculateLighthouseMetricsFromTTAI && PPSMetricsAtTTAI !== null) {
			return PPSMetricsAtTTAI;
		}

		if (PPSMetricsAtTTI !== null) {
			return {
				...PPSMetricsAtTTI,
				'metrics@ttai': PPSMetricsAtTTAI,
			};
		}
	}

	return {};
}
