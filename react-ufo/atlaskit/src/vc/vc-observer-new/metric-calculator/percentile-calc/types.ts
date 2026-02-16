import type { VCObserverEntry, ViewportEntryData } from '../../types';

export type CalcTTVCPercentilesArg = {
	viewport: {
		width: number;
		height: number;
	};
	orderedEntries: ReadonlyArray<VCObserverEntry>;
	percentiles: number[];
	startTime: DOMHighResTimeStamp;
	stopTime: DOMHighResTimeStamp;
};

export type CalcTTVCPercentilesArgWithDebugInfo = {
	viewport: {
		width: number;
		height: number;
	};
	orderedEntries: ReadonlyArray<VCObserverEntry>;
	startTime: DOMHighResTimeStamp;
	stopTime: DOMHighResTimeStamp;
};

export interface PercentileCalcResultItem {
	time: number;
	viewportPercentage: number;
	entries: ViewportEntryData[];
}

/**
 * Ordered by time
 */
export type PercentileCalcResult = PercentileCalcResultItem[];

/**
 * Result of percentile calculation with debug info, including speed index
 */
export type PercentileCalcResultWithSpeedIndex = {
	entries: PercentileCalcResult;
	speedIndex: number;
};
