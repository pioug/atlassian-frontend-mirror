import { RevisionPayloadEntry } from '../../../common/vc/types';
import type { VCObserverEntry } from '../types';

export type VCCalculatorParam = {
	startTime: DOMHighResTimeStamp;
	stopTime: DOMHighResTimeStamp;
	orderedEntries: ReadonlyArray<VCObserverEntry>;
};

export interface VCCalculator {
	calculate(param: VCCalculatorParam): Promise<RevisionPayloadEntry | undefined>;
}
