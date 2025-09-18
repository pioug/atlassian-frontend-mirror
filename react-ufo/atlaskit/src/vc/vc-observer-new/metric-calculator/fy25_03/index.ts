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

const getConsideredEntryTypes = (include3p?: boolean): VCObserverEntryType[] => {
	const entryTypes: VCObserverEntryType[] = [
		'mutation:child-element',
		'mutation:element',
		'mutation:attribute',
		'layout-shift',
		'window:event',
	];

	// If not exclude 3p elements from ttvc,
	// including the tags into the ConsideredEntryTypes so that it won't be ignored for TTVC calculation
	if (!fg('platform_ufo_exclude_3p_elements_from_ttvc') || include3p) {
		entryTypes.push('mutation:third-party-element');
	}

	if (fg('platform_ufo_enable_media_for_ttvc_v3')) {
		entryTypes.push('mutation:media');
	}
	return entryTypes;
};

// TODO: AFO-3523
// Those are the attributes we have found when testing the 'fy25.03' manually.
// We still need to replace this hardcoded list with a proper automation
export const KNOWN_ATTRIBUTES_THAT_DOES_NOT_CAUSE_LAYOUT_SHIFTS: string[] = [
	'data-drop-target-for-element',
	'data-drop-target-for-external',
	'draggable',
	'data-is-observed',
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

// Common third party browser extension attributes
export const THIRD_PARTY_BROWSER_EXTENSION_ATTRIBUTES: string[] = [
	'bis_skin_checked',
	'cz-shortcut-listen',
	'monica-version',
	'data-gr-ext-installed',
	'data-dashlane-rid',
	'sapling-installed',
	'data-gptw',
	// grammarly extensions
	'data-new-gr-c-s-loaded',
	'data-gr-aaa-notch-connection-id',
	'data-gr-aaa-loaded',
];

export default class VCCalculator_FY25_03 extends AbstractVCCalculatorBase {
	constructor(revisionNo?: string) {
		super(revisionNo ?? REVISION_NO);
	}

	protected isEntryIncluded(entry: VCObserverEntry, include3p?: boolean): boolean {
		if (!getConsideredEntryTypes(include3p).includes(entry.data.type)) {
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
				attributeName.startsWith('data-test') ||
				attributeName === 'data-aui-version' ||
				attributeName === 'data-testid' ||
				attributeName === 'data-vc' ||
				attributeName === 'data-ssr-placeholder' ||
				attributeName === 'data-ssr-placeholder-replace' ||
				attributeName === 'data-vc-nvs' ||
				attributeName === 'data-media-vc-wrapper' ||
				attributeName === 'data-renderer-start-pos' ||
				attributeName === 'data-table-local-id' ||
				attributeName === 'spellcheck' ||
				attributeName === 'data-auto-scrollable' ||
				attributeName === 'id' ||
				attributeName === 'tabindex' ||
				attributeName === 'data-is-ttvc-ready' ||
				attributeName === 'contenteditable' ||
				attributeName === 'data-has-collab-initialised' ||
				attributeName === 'translate' ||
				NON_VISUAL_ARIA_ATTRIBUTES.includes(attributeName) ||
				(THIRD_PARTY_BROWSER_EXTENSION_ATTRIBUTES.includes(attributeName) &&
					fg('platform_ufo_exclude_3p_extensions_from_ttvc'))
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
		let abortTimestamp = -1;
		const hasAbortEvent = filteredEntries.some((entry) => {
			if (entry.data.type === 'window:event') {
				const data = entry.data as WindowEventEntryData;
				if (ABORTING_WINDOW_EVENT.includes(data.eventType)) {
					dirtyReason = data.eventType === 'keydown' ? 'keypress' : data.eventType;
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
