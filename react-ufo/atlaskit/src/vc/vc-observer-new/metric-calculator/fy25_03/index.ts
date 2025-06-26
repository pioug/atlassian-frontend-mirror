import { fg } from '@atlaskit/platform-feature-flags';

import type { VCAbortReason } from '../../../../common/vc/types';
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

const getConsideredEntryTypes = (): VCObserverEntryType[] => {
	const entryTypes: VCObserverEntryType[] = [
		'mutation:child-element',
		'mutation:element',
		'mutation:attribute',
		'layout-shift',
		'window:event',
	];

	// If not exclude 3p elements from ttvc,
	// including the tags into the ConsideredEntryTypes so that it won't be ignored for TTVC calculation
	if (!fg('platform_ufo_exclude_3p_elements_from_ttvc')) {
		entryTypes.push('mutation:third-party-element');
	}
	return entryTypes;
};

// TODO: AFO-3523
// Those are the attributes we have found when testing the 'fy25.03' manually.
// We still need to replace this hardcoded list with a proper automation
export const KNOWN_ATTRIBUTES_THAT_DOES_NOT_CAUSE_LAYOUT_SHIFTS: string[] = [
	'data-drop-target-for-element',
	'draggable',
];

// Common aria attributes that don't cause visual layout shifts
export const NON_VISUAL_ARIA_ATTRIBUTES: string[] = [
	'aria-label',
	'aria-labelledby',
	'aria-describedby',
	'aria-hidden',
	'aria-expanded',
	'aria-controls',
	'aria-selected',
	'aria-checked',
	'aria-disabled',
	'aria-required',
	'aria-current',
	'aria-haspopup',
	'aria-pressed',
	'aria-atomic',
	'aria-live',
];

export default class VCCalculator_FY25_03 extends AbstractVCCalculatorBase {
	constructor() {
		super(REVISION_NO);
	}

	protected isEntryIncluded(entry: VCObserverEntry): boolean {
		if (!getConsideredEntryTypes().includes(entry.data.type)) {
			return false;
		}
		if (entry.data.type === 'mutation:attribute') {
			const entryData = entry.data as ViewportEntryData;
			const attributeName = entryData.attributeName;
			if (
				!attributeName ||
				KNOWN_ATTRIBUTES_THAT_DOES_NOT_CAUSE_LAYOUT_SHIFTS.includes(attributeName)
			) {
				return false;
			}

			if (
				attributeName === 'data-aui-version' ||
				attributeName === 'data-testid' ||
				attributeName === 'data-vc' ||
				attributeName === 'data-ssr-placeholder' ||
				attributeName === 'data-ssr-placeholder-replace' ||
				attributeName === 'data-vc-nvs' ||
				attributeName === 'data-media-vc-wrapper' ||
				((attributeName === 'data-renderer-start-pos' ||
					attributeName === 'data-table-local-id' ||
					attributeName === 'spellcheck') &&
					fg('platform_ufo_ignore_extra_attributes')) ||
				attributeName === 'data-auto-scrollable' ||
				attributeName === 'id' ||
				attributeName === 'tabindex' ||
				NON_VISUAL_ARIA_ATTRIBUTES.includes(attributeName)
			) {
				return false;
			}

			return true;
		}
		if (isViewportEntryData(entry.data) && !entry.data.visible) {
			return false;
		}

		return true;
	}

	protected getVCCleanStatus(filteredEntries: readonly VCObserverEntry[]) {
		let dirtyReason: VCAbortReason | '' = '';
		const hasAbortEvent = filteredEntries.some((entry) => {
			if (entry.data.type === 'window:event') {
				const data = entry.data as WindowEventEntryData;
				if (ABORTING_WINDOW_EVENT.includes(data.eventType)) {
					dirtyReason = data.eventType === 'keydown' ? 'keypress' : data.eventType;
					return true;
				}
			}
			return false;
		});

		if (hasAbortEvent && dirtyReason) {
			return {
				isVCClean: false,
				dirtyReason,
			};
		}

		return {
			isVCClean: true,
		};
	}
}
