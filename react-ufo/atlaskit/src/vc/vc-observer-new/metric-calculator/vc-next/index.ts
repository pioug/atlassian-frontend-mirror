import type { VCAbortReason } from '../../../../common/vc/types';
import type { VCObserverEntry, VCObserverEntryType, WindowEventEntryData } from '../../types';
import VCCalculator_FY26_04 from '../fy26_04';

const ABORTING_WINDOW_EVENT = ['wheel', 'scroll', 'keydown', 'resize', 'scroll-container'] as const;

const getConsideredEntryTypes = () => {
	const consideredEntryTypes: VCObserverEntryType[] = [];

	return consideredEntryTypes;
};

const getExcludedEntryTypes = () => {
	const excludedEntryTypes: VCObserverEntryType[] = [];

	return excludedEntryTypes;
};

export default class VCCalculator_Next extends VCCalculator_FY26_04 {
	constructor() {
		super('next');
	}

	protected isEntryIncluded(
		entry: VCObserverEntry,
		include3p?: boolean,
		excludeSmartAnswersInSearch?: boolean,
	): boolean {
		const isEntryIncludedInV4 = super.isEntryIncluded(
			entry,
			include3p,
			excludeSmartAnswersInSearch,
		);

		if (isEntryIncludedInV4 && !getExcludedEntryTypes().includes(entry.data.type)) {
			return true;
		}

		return getConsideredEntryTypes().includes(entry.data.type);
	}

	protected getVCCleanStatus(filteredEntries: readonly VCObserverEntry[]):
		| {
				isVCClean: boolean;
				dirtyReason: never;
				abortTimestamp: number;
		  }
		| {
				isVCClean: boolean;
				dirtyReason?: undefined;
				abortTimestamp?: undefined;
		  } {
		let dirtyReason: VCAbortReason | '' = '';
		let abortTimestamp = -1;
		const hasAbortEvent = filteredEntries.some((entry) => {
			if (entry.data.type === 'window:event') {
				const data = entry.data as WindowEventEntryData;
				const eventType = data.eventType as (typeof ABORTING_WINDOW_EVENT)[number];
				if (ABORTING_WINDOW_EVENT.includes(eventType)) {
					if (eventType === 'keydown') {
						dirtyReason = 'keypress';
					} else if (eventType === 'scroll-container') {
						dirtyReason = 'scroll';
					} else {
						dirtyReason = eventType as VCAbortReason;
					}
					abortTimestamp = Math.round(entry.time);
					return true;
				}
			}
			return false;
		});

		if (hasAbortEvent && dirtyReason) {
			return {
				isVCClean: false,
				dirtyReason,
				abortTimestamp,
			};
		}

		return {
			isVCClean: true,
		};
	}
}
