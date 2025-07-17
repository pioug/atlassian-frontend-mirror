import { fg } from '@atlaskit/platform-feature-flags';

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
		fg('platform_ufo_segment_critical_metrics')
			? createSegmentMetricsPayloads(interactionId, interaction)
			: [],
	]);
	return [rootPayload, ...segmentPayloads].filter((v): v is CriticalMetricsPayload => v != null);
}
