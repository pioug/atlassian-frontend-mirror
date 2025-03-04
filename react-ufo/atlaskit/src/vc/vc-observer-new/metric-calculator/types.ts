import type { VCObserverEntry } from '../types';

export type RevisionPayloadVCDetails = {
	[key: string]: {
		t: number;
		e: string[];
	};
};

export type RevisionPayloadEntry = {
	'metric:vc90': number | null;
	revision: string;
	clean: boolean;
	vcDetails?: RevisionPayloadVCDetails;
};

export type RevisionPayload = RevisionPayloadEntry[];

export type VCCalculatorParam = {
	orderedEntries: ReadonlyArray<VCObserverEntry>;
};

export interface VCCalculator {
	calculate(param: VCCalculatorParam): Promise<RevisionPayloadEntry | undefined>;
}
