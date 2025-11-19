import { roundEpsilon } from '../../../round-number';
import type { ResourceEntry } from '../types';

const getPerformanceObject = () => (window ?? {}).performance;
const getPerformanceObserverObject = () => (window ?? {}).PerformanceObserver;

export const resourceTimingBuffer = {
	timings: [] as ResourceEntry[],
	maxSize: 1000,
	observer: null as PerformanceObserver | null,
	transformResource(entry: PerformanceResourceTiming): ResourceEntry {
		const duration = roundEpsilon(entry.duration);

		// prioritising atl-edge
		const totalBackendTimeEntry =
			entry.serverTiming?.find((timing) => timing.name === 'atl-edge') ||
			entry.serverTiming?.find(
				// timing name should come from per-product config in the future
				(timing) => timing.name === 'total' || timing.name === 'filter-request-papi',
			);

		const serverTime = totalBackendTimeEntry
			? roundEpsilon(totalBackendTimeEntry.duration)
			: undefined;
		const networkTime = serverTime ? duration - serverTime : undefined;

		return {
			name: entry.name,
			initiatorType: entry.initiatorType,
			transferSize: entry.transferSize,
			startTime: roundEpsilon(entry.startTime),
			duration: roundEpsilon(entry.duration),
			fetchStart: roundEpsilon(entry.fetchStart || 0),
			workerStart: roundEpsilon(entry.workerStart || 0),
			responseStart: roundEpsilon(entry.responseStart || 0),
			requestStart: roundEpsilon(entry.requestStart || 0),
			serverTime,
			networkTime,
			encodedSize: roundEpsilon(entry.encodedBodySize),
			decodedSize: roundEpsilon(entry.decodedBodySize),
		};
	},
	start(): void {
		const performance = getPerformanceObject();
		const PerformanceObserver = getPerformanceObserverObject();

		if (!PerformanceObserver || !performance || typeof PerformanceObserver === 'undefined') {
			return;
		}
		if (resourceTimingBuffer.observer) {
			return;
		}
		const resources = performance.getEntriesByType?.('resource');
		if (resources) {
			resourceTimingBuffer.timings = resources.map((resource) =>
				resourceTimingBuffer.transformResource(resource as PerformanceResourceTiming),
			);
		}
		resourceTimingBuffer.observer = new PerformanceObserver(resourceTimingBuffer.addTimings);
		resourceTimingBuffer.observer.observe({ entryTypes: ['resource'] });
	},
	stop(): void {
		if (resourceTimingBuffer.observer) {
			resourceTimingBuffer.observer.disconnect();
			resourceTimingBuffer.observer = null;
		}
		resourceTimingBuffer.timings = [];
	},
	addTimings(list: PerformanceObserverEntryList): void {
		const entries = list
			.getEntries()
			.map((entry: PerformanceEntry) =>
				resourceTimingBuffer.transformResource(entry as PerformanceResourceTiming),
			);
		const overflow = resourceTimingBuffer.timings.length + entries.length;
		if (overflow > resourceTimingBuffer.maxSize) {
			const fieldsToRemove = overflow - resourceTimingBuffer.maxSize;
			resourceTimingBuffer.timings.splice(0, fieldsToRemove);
		}
		resourceTimingBuffer.timings.push(...entries);
	},
};

function isValidTiming(
	timing: PerformanceResourceTiming | ResourceEntry,
	startTime: number,
	endTime: number,
) {
	return timing.startTime >= startTime && timing.startTime + timing.duration <= endTime;
}

export function filterResourceTimings(startTime: number, endTime: number): ResourceEntry[] | null {
	const performance = getPerformanceObject();
	const PerformanceObserver = getPerformanceObserverObject();
	if (!PerformanceObserver || !resourceTimingBuffer.observer) {
		const resources = performance?.getEntriesByType('resource') as PerformanceResourceTiming[];
		if (resources) {
			return resources.filter((timing) => isValidTiming(timing, startTime, endTime));
		}
		return null;
	}
	return resourceTimingBuffer.timings.filter((timing) => isValidTiming(timing, startTime, endTime));
}
