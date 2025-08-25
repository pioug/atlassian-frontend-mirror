import type { RevisionPayloadEntry } from '../../../common/vc/types';
import type { VCObserverEntry } from '../types';

export type VCCalculatorParam = {
	startTime: DOMHighResTimeStamp;
	stopTime: DOMHighResTimeStamp;
	orderedEntries: ReadonlyArray<VCObserverEntry>;
	interactionId?: string;
	isPostInteraction: boolean;
	include3p?: boolean;
};

export interface VCCalculator {
	calculate(param: VCCalculatorParam): Promise<RevisionPayloadEntry | undefined>;
}
