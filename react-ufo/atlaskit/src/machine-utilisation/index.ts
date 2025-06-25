import type {
	MemoryRecord,
	PressureObserverInstance,
	PressureObserver as PressureObserverInterface,
	PressureRecord,
} from './types';

declare global {
	var PressureObserver: PressureObserverInterface;
}

const BUFFER_MAX_LENGTH = 1000; // ensure we don't blow up this buffer
let pressureRecordBuffer: PressureRecord[] = [];
let pressureObserver: PressureObserverInstance | null = null;
let memoryRecordBuffer: MemoryRecord[] = [];
let memoryInterval: ReturnType<typeof setInterval>;

export function resetPressureRecordBuffer() {
	pressureRecordBuffer.length = 0;
}

export function resetMemoryRecordBuffer() {
	memoryRecordBuffer.length = 0;
}

export function removeOldPressureBufferRecords(filter: DOMHighResTimeStamp) {
	pressureRecordBuffer = pressureRecordBuffer.filter(({ time }) => time > filter);
}

export function removeOldMemoryBufferRecords(filter: DOMHighResTimeStamp) {
	memoryRecordBuffer = memoryRecordBuffer.filter(({ time }) => time > filter);
}

export function createPressureStateReport(start: DOMHighResTimeStamp, end: DOMHighResTimeStamp) {
	try {
		// To differentiate between the API not available, vs no PressureRecords added
		if (!('PressureObserver' in globalThis)) {
			return null;
		}

		const pressureStateCount = pressureRecordBuffer.reduce(
			(pressureReport, { time, state }) => {
				if (time >= start && time <= end) {
					pressureReport[state] += 1;
				}

				return pressureReport;
			},
			{
				nominal: 0,
				fair: 0,
				serious: 0,
				critical: 0,
			},
		);

		const pressureStateTotal =
			Object.values(pressureStateCount).reduce((total, count) => total + count) || 1;

		removeOldPressureBufferRecords(end);

		return {
			count: pressureStateCount,
			percentage: {
				nominal: Math.round((pressureStateCount.nominal / pressureStateTotal) * 100),
				fair: Math.round((pressureStateCount.fair / pressureStateTotal) * 100),
				serious: Math.round((pressureStateCount.serious / pressureStateTotal) * 100),
				critical: Math.round((pressureStateCount.critical / pressureStateTotal) * 100),
			},
		};
	} catch {
		return null;
	}
}

function convertBytesToMegabytes(bytes: number): number {
	return Math.round(Math.round((bytes / (1024 * 1024)) * 100) / 100);
}

export function createMemoryStateReport(start: DOMHighResTimeStamp, end: DOMHighResTimeStamp) {
	try {
		if (!('memory' in performance)) {
			return null;
		}

		const accumulatedMemoryUsage = memoryRecordBuffer.reduce(
			(acc, snapshot) => {
				if (snapshot.time >= start && snapshot.time <= end) {
					acc.totalJSHeapSize += snapshot.totalJSHeapSize;
					acc.usedJSHeapSize += snapshot.usedJSHeapSize;
					acc.snapshotCount += 1;
				}
				return acc;
			},
			{
				totalJSHeapSize: 0,
				usedJSHeapSize: 0,
				snapshotCount: 0,
			},
		);

		const memoryStateReport = {
			jsHeapSizeLimitInMB: convertBytesToMegabytes(memoryRecordBuffer[0].jsHeapSizeLimit), // just use the first record, since this value always remains the same over time
			avgTotalJSHeapSizeInMB: convertBytesToMegabytes(
				accumulatedMemoryUsage.totalJSHeapSize / accumulatedMemoryUsage.snapshotCount,
			),
			avgUsedJSHeapSizeInMB: convertBytesToMegabytes(
				accumulatedMemoryUsage.usedJSHeapSize / accumulatedMemoryUsage.snapshotCount,
			),
		};

		removeOldMemoryBufferRecords(end);

		return memoryStateReport;
	} catch {
		return null;
	}
}

export function initialisePressureObserver() {
	try {
		if ('PressureObserver' in globalThis) {
			pressureObserver = new PressureObserver((records) => {
				if (pressureRecordBuffer.length + records.length <= BUFFER_MAX_LENGTH) {
					pressureRecordBuffer.push(...records);
				}
			});

			pressureObserver.observe('cpu', { sampleInterval: 100 }).catch();
		}
	} catch (err) {
		/* do nothing, this is a best efforts metric */
	}
}

export function initialiseMemoryObserver() {
	try {
		// only set up the interval if `performance.memory` is available in the browser
		if ('memory' in performance) {
			memoryInterval = setInterval(() => {
				// another check of `performance.memory` availability to satisfy typescript
				if ('memory' in performance) {
					const memory = performance.memory as Omit<MemoryRecord, 'time'>;

					if (memoryRecordBuffer.length <= BUFFER_MAX_LENGTH) {
						memoryRecordBuffer.push({
							time: performance.now(),
							jsHeapSizeLimit: memory.jsHeapSizeLimit,
							totalJSHeapSize: memory.totalJSHeapSize,
							usedJSHeapSize: memory.usedJSHeapSize,
						});
					}
				}
			}, 100);
		}
	} catch {
		/* do nothing, this is a best efforts metric */
	}
}

export function disconnectMemoryObserver() {
	clearInterval(memoryInterval);
}

export function disconnectPressureObserver() {
	pressureObserver?.disconnect();
}
