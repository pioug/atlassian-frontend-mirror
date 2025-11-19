import type { InteractionType } from '../../common';

export interface NavigationMetrics {
	// From https://www.w3.org/TR/resource-timing/
	redirectStart: number;
	redirectEnd: number;
	fetchStart: number;
	domainLookupStart: number;
	domainLookupEnd: number;
	connectStart: number;
	connectEnd: number;
	secureConnectionStart: number;
	requestStart: number;
	responseStart: number;
	responseEnd: number;
	encodedBodySize: number;
	decodedBodySize: number;
	transferSize: number;

	// From https://www.w3.org/TR/navigation-timing-2/
	redirectCount: number;
	type: string;
	unloadEventEnd: number;
	unloadEventStart: number;
	workerStart: number;

	nextHopProtocol: string;
}

export default function getNavigationMetrics(type: InteractionType): NavigationMetrics | null {
	if (type !== 'page_load') {
		return null;
	}

	try {
		const entries = performance.getEntriesByType('navigation');
		if (entries.length === 0) {
			return null;
		}

		const navigation = entries[0] as PerformanceNavigationTiming;

		return {
			// From https://www.w3.org/TR/resource-timing/
			redirectStart: Math.round(navigation.redirectStart),
			redirectEnd: Math.round(navigation.redirectEnd),
			fetchStart: Math.round(navigation.fetchStart),
			domainLookupStart: Math.round(navigation.domainLookupStart),
			domainLookupEnd: Math.round(navigation.domainLookupEnd),
			connectStart: Math.round(navigation.connectStart),
			connectEnd: Math.round(navigation.connectEnd),
			secureConnectionStart: Math.round(navigation.secureConnectionStart),
			requestStart: Math.round(navigation.requestStart),
			responseStart: Math.round(navigation.responseStart),
			responseEnd: Math.round(navigation.responseEnd),
			encodedBodySize: Math.round(navigation.encodedBodySize),
			decodedBodySize: Math.round(navigation.decodedBodySize),
			transferSize: Math.round(navigation.transferSize),

			// From https://www.w3.org/TR/navigation-timing-2/
			redirectCount: navigation.redirectCount,
			type: navigation.type,
			unloadEventEnd: Math.round(navigation.unloadEventEnd),
			unloadEventStart: Math.round(navigation.unloadEventStart),
			workerStart: Math.round(navigation.workerStart),

			nextHopProtocol: navigation.nextHopProtocol,

			// The following properties are ignored because they provided limited value on a modern stack (e.g. the content
			// is usually rendered and interactive before the dom is fully parsed, don't play well with streamed content...)
			//   * domComplete
			//   * domContentLoadedEventEnd
			//   * domContentLoadedEventStart
			//   * domInteractive
			//   * loadEventEnd
			//   * loadEventStart
		};
	} catch (error) {
		// Return null if there's any error accessing navigation timing
		return null;
	}
}

// Helper function to get navigation metrics in legacy format for backward compatibility
export function getNavigationMetricsToLegacyFormat(type: InteractionType):
	| {
			'metrics:navigation'?: undefined;
	  }
	| {
			'metrics:navigation': NavigationMetrics;
	  } {
	const navigationMetrics = getNavigationMetrics(type);

	if (!navigationMetrics) {
		return {};
	}

	return {
		'metrics:navigation': navigationMetrics,
	};
}
