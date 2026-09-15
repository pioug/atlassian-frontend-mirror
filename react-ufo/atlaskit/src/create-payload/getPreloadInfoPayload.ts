import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { InteractionMetrics } from '../common';
import type { OptimizedPreloadInfo } from '../common/react-ufo-payload-schema';

export function getPreloadInfoPayload(
	interaction: InteractionMetrics,
	start: number,
): { preloadInfo?: OptimizedPreloadInfo[] } {
	if (!fg('platform_ufo_preload_hold_adoption')) {
		return {};
	}

	const { preloadInfo } = interaction;
	if (preloadInfo.length === 0) {
		return {};
	}

	return {
		preloadInfo: preloadInfo.map((row) => ({
			source: row.source,
			preloadStartedAt: Math.round(row.preloadStartedAt - start),
			adoptedAt: Math.round(row.adoptedAt - start),
			...(row.settledAt != null ? { settledAt: Math.round(row.settledAt - start) } : {}),
		})),
	};
}
