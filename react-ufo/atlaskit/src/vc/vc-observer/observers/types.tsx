import { type VCIgnoreReason } from '../../../common/vc/types';

export type Callback = (
	time: number,
	box: DOMRectReadOnly,
	targetName: string,
	node: HTMLElement,
	type: string,
	ignoreReason?: VCIgnoreReason,
) => void;
export type MutationRecordWithTimestamp = MutationRecord & {
	timestamp?: number;
};
export interface BrowserObservers {
	observe: () => void;
	disconnect: () => void;
	subscribeResults: (cb: Callback) => void;
	getTotalTime: () => number;
}
