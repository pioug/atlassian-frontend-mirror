import type {
	VCObserverEntry,
	VCObserverEntryType,
	ViewportEntryData,
	WindowEventEntryData,
} from '../../types';
import AbstractVCCalculatorBase from '../abstract-base-vc-calculator';
import isViewportEntryData from '../utils/is-viewport-entry-data';

const ABORTING_WINDOW_EVENT = ['wheel', 'scroll', 'keydown', 'resize'] as const;

const REVISION_NO = 'fy25.03';

const CONSIDERED_ENTRY_TYPE: VCObserverEntryType[] = [
	'mutation:child-element',
	'mutation:element',
	'mutation:attribute',
	'layout-shift',
	'window:event',
];

export default class VCCalculator_FY25_03 extends AbstractVCCalculatorBase {
	constructor() {
		super(REVISION_NO);
	}
	protected isEntryIncluded(entry: VCObserverEntry): boolean {
		if (!CONSIDERED_ENTRY_TYPE.includes(entry.type)) {
			return false;
		}
		if (entry.type === 'mutation:attribute') {
			const entryData = entry.data as ViewportEntryData;
			const attributeName = entryData.attributeName;
			if (!attributeName) {
				return false;
			}
			return true;
		}
		if (isViewportEntryData(entry.data) && !entry.data.visible) {
			return false;
		}

		return true;
	}

	protected isVCClean(filteredEntries: readonly VCObserverEntry[]): boolean {
		const hasAbortEvent = filteredEntries.some((entry) => {
			if (entry.type === 'window:event') {
				const data = entry.data as WindowEventEntryData;
				if (ABORTING_WINDOW_EVENT.includes(data.eventType)) {
					return true;
				}
			}
			return false;
		});
		return !hasAbortEvent;
	}
}
