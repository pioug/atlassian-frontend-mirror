import type { InteractionType } from '../../common';

// Type definitions for paint metrics
export interface PaintMetrics {
	fp?: number;
	fcp?: number;
	lcp?: number;
}

export interface LegacyPaintMetrics {
	'metric:fp'?: number;
	'metric:fcp'?: number;
	'metric:lcp'?: number;
}

// Main function returns compact nested format
export default async function getPaintMetrics(
	type: InteractionType,
	end: number,
): Promise<PaintMetrics> {
	if (type !== 'page_load') {
		return {};
	}

	const paint: PaintMetrics = {};
	const paintEntries = performance.getEntriesByType('paint');

	paintEntries.forEach((entry) => {
		if (entry.name === 'first-paint') {
			paint.fp = Math.round(entry.startTime);
		}
		if (entry.name === 'first-contentful-paint') {
			paint.fcp = Math.round(entry.startTime);
		}
	});

	// Get LCP using PerformanceObserver
	const lcp = await new Promise<number | null>((resolve) => {
		// Check if we already have LCP entries
		const existingEntries = performance.getEntriesByType('largest-contentful-paint');
		const lastEntry = existingEntries.reduce<PerformanceEntry | null>((agg, entry) => {
			if (entry.startTime <= end && (agg === null || agg.startTime < entry.startTime)) {
				return entry;
			}
			return agg;
		}, null);

		if (lastEntry) {
			resolve(lastEntry.startTime);
			return;
		}

		const observer = new PerformanceObserver((list) => {
			const entries = Array.from(list.getEntries());
			const lastEntry = entries.reduce<PerformanceEntry | null>((agg, entry) => {
				if (entry.startTime <= end && (agg === null || agg.startTime < entry.startTime)) {
					return entry;
				}
				return agg;
			}, null);

			clearTimeout(timeoutId);
			observer.disconnect();

			if (lastEntry) {
				resolve(lastEntry.startTime);
			} else {
				resolve(null);
			}
		});
		observer.observe({ type: 'largest-contentful-paint', buffered: true });

		const timeoutId = setTimeout(() => {
			observer.disconnect();
			resolve(null);
		}, 200);
	});

	if (lcp) {
		paint.lcp = Math.round(lcp);
	}

	return paint;
}

// Helper function to get paint metrics in legacy colon format for backward compatibility
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
