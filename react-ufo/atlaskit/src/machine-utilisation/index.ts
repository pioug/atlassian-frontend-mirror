import type {
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

export function resetPressureRecordBuffer() {
	pressureRecordBuffer.length = 0;
}

export function removeOldBufferRecords(filter: DOMHighResTimeStamp) {
	pressureRecordBuffer = pressureRecordBuffer.filter(({ time }) => time > filter);
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

		removeOldBufferRecords(end);

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

export function initialisePressureObserver() {
	try {
		if ('PressureObserver' in globalThis) {
			pressureObserver = new PressureObserver((records) => {
				if (pressureRecordBuffer.length + records.length <= BUFFER_MAX_LENGTH) {
					pressureRecordBuffer.push(...records);
				}
			});

			pressureObserver.observe('cpu', { sampleInterval: 100 })?.catch();
		}
	} catch (err) {
		/* do nothing, this is a best efforts metric */
	}
}

export function disconnectPressureObserver() {
	pressureObserver?.disconnect();
}
