import type { VCObserverEntry } from '../../types';

export type CalcTTVCPercentilesArg = {
	viewport: {
		width: number;
		height: number;
	};
	startTime: DOMHighResTimeStamp;
	stopTime: DOMHighResTimeStamp;
	orderedEntries: ReadonlyArray<VCObserverEntry>;
	percentiles: number[];
};
