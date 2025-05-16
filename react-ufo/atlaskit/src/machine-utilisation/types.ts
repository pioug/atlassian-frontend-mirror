// From https://developer.mozilla.org/en-US/docs/Web/API/PressureRecord as at 14th May 2025
export type PressureRecord = {
	source: 'cpu' | 'thermals';
	state: 'nominal' | 'fair' | 'serious' | 'critical';
	time: DOMHighResTimeStamp;
	toJSON: () => Omit<PressureRecord, 'toJSON'>;
};

// From https://developer.mozilla.org/en-US/docs/Web/API/PressureRecord as at 14th May 2025
export type PressureObserverCallback = (
	changes: PressureRecord[],
	observer: PressureObserverInstance,
) => void;

export interface PressureObserverInstance {
	readonly knownSources: PressureRecord['source'];
	disconnect: () => void;
	takeRecords: () => PressureRecord[];
	unobserve: (source: PressureRecord['source']) => void;
	observe: (
		source: PressureRecord['source'],
		options?: { sampleInterval?: number },
	) => Promise<void>;
}

export interface PressureObserver {
	new (callback: PressureObserverCallback): PressureObserverInstance;
}
