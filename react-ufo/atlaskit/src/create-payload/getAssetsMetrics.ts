import { CHRReporter } from '../assets/CHRReporter';
import type { InteractionMetrics } from '../common';
import { getConfig } from '../config';
import { filterResourceTimings } from '../resource-timing/common/utils/resource-timing-buffer';

export function getAssetsMetrics(
	interaction: InteractionMetrics,
	SSRDoneTime: number | undefined,
): any {
	try {
		const config = getConfig();
		const { type } = interaction;
		const allowedTypes = ['page_load'];
		const assetsConfig = config?.assetsConfig;
		if (!allowedTypes.includes(type) || !assetsConfig) {
			// Skip if: type not allowed or assetsClassification isn't configured
			return {};
		}
		const reporter = new CHRReporter();
		const resourceTimings = filterResourceTimings(interaction.start, interaction.end);
		const assets = reporter.get(resourceTimings, assetsConfig, SSRDoneTime);
		if (assets) {
			// Only add assets in case it exists
			return { 'event:assets': assets };
		}
		return {};
	} catch {
		// Skip CHR in case of error
		return {};
	}
}
