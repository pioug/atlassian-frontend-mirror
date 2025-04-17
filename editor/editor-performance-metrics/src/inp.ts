import { onINP, type Metric, type CleanupOnINP as CleanupINPTracking } from './internals/onINP';

type INPCallback = (param: Pick<Metric, 'value'>) => void;
export const setupINPTracking = (callback: INPCallback): CleanupINPTracking | undefined => {
	if (!isINPSupported()) {
		return;
	}

	return onINP((metric: Metric) => {
		callback({
			value: metric.value,
		});
	});
};

const isINPSupported = () => {
	const isSSR = typeof process !== 'undefined' && Boolean(process?.env?.REACT_SSR || false);
	if (isSSR) {
		return false;
	}
	// Return if the browser doesn't support all APIs needed to measure INP.
	if (!('PerformanceEventTiming' in self && 'interactionId' in PerformanceEventTiming.prototype)) {
		return false;
	}

	if (
		!PerformanceObserver.supportedEntryTypes.includes('event') &&
		!PerformanceObserver.supportedEntryTypes.includes('first-input')
	) {
		return false;
	}
	return true;
};
