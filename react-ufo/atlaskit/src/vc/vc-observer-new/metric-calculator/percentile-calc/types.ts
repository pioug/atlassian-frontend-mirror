import type { VCObserverEntry } from '../../types';

export type CalcTTVCPercentilesArg = {
	viewport: {
		width: number;
		height: number;
	};
	orderedEntries: ReadonlyArray<VCObserverEntry>;
	percentiles: number[];
};
