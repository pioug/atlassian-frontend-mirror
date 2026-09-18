import type { InteractionType } from '../../common';
import getPaintMetrics, { type LegacyPaintMetrics } from './get-paint-metrics';

// Helper function to get paint metrics in legacy colon format for backward compatibility
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export async function getPaintMetricsToLegacyFormat(
	type: InteractionType,
	end: number,
): Promise<LegacyPaintMetrics> {
	const paint = await getPaintMetrics(type, end);
	const legacyFormat: LegacyPaintMetrics = {};

	if (paint.fp !== undefined) {
		legacyFormat['metric:fp'] = paint.fp;
	}
	if (paint.fcp !== undefined) {
		legacyFormat['metric:fcp'] = paint.fcp;
	}
	if (paint.lcp !== undefined) {
		legacyFormat['metric:lcp'] = paint.lcp;
	}

	return legacyFormat;
}
