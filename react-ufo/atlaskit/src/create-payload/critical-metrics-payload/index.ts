import type { InteractionMetrics } from '../../common';
import type { VCResult } from '../../common/vc/types';

import { createRootCriticalMetricsPayload } from './root-metrics';
import { createSegmentMetricsPayloads } from './segment-metrics/create-segment-metrics';
import { type CriticalMetricsPayload } from './types';

export async function createCriticalMetricsPayloads(
	interactionId: string,
	interaction: InteractionMetrics,
	vcMetrics?: VCResult & { 'metric:vc90'?: number | null },
): Promise<CriticalMetricsPayload[]> {
	const [rootPayload, segmentPayloads] = await Promise.all([
		createRootCriticalMetricsPayload(interactionId, interaction, vcMetrics),
		createSegmentMetricsPayloads(interactionId, interaction),
	]);
	return [rootPayload, ...segmentPayloads];
}
