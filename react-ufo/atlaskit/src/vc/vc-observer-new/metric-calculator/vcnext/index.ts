import { fg } from '@atlaskit/platform-feature-flags';

import type { VCObserverEntry, VCObserverEntryType, ViewportEntryData } from '../../types';
import VCCalculator_FY25_03 from '../fy25_03';
import {
	KNOWN_ATTRIBUTES_THAT_DOES_NOT_CAUSE_LAYOUT_SHIFTS,
	NON_VISUAL_ARIA_ATTRIBUTES,
	THIRD_PARTY_BROWSER_EXTENSION_ATTRIBUTES,
} from '../utils/constants';

// NOTE: `next` to be renamed `fy26.04` once stable
const REVISION_NO = 'next';

const getConsideredEntryTypes = () => {
	const consideredEntryTypes: VCObserverEntryType[] = [
		'mutation:display-contents-children-element',
	];

	if (fg('platform_ufo_remove_ssr_placeholder_in_ttvc_v4')) {
		consideredEntryTypes.push('mutation:ssr-placeholder');
	}

	if (fg('platform_ufo_detect_zero_dimension_rectangles')) {
		consideredEntryTypes.push('mutation:display-contents-children-attribute');
	}

	return consideredEntryTypes;
};

const getExcludedEntryTypes = () => {
	const excludedEntryTypes: VCObserverEntryType[] = ['layout-shift:same-rect'];

	if (fg('platform_ufo_ttvc_v4_exclude_input_name_mutation')) {
		excludedEntryTypes.push('mutation:attribute:non-visual-input-name');
	}

	return excludedEntryTypes;
};

// NOTE: `VCNext` to be renamed `FY26_04` once stable
export default class VCNextCalculator extends VCCalculator_FY25_03 {
	constructor() {
		super(REVISION_NO);
	}

	protected isEntryIncluded(entry: VCObserverEntry, include3p?: boolean): boolean {
		const isEntryIncludedInV3 = super.isEntryIncluded(entry, include3p);

		if (isEntryIncludedInV3 && !getExcludedEntryTypes().includes(entry.data.type)) {
			return true;
		}

		if (
			entry.data.type === 'mutation:display-contents-children-attribute' &&
			fg('platform_ufo_fix_ttvc_v4_attribute_exclusions')
		) {
			const entryData = entry.data as ViewportEntryData;
			const attributeName = entryData.attributeName;

			if (
				!attributeName ||
				attributeName.startsWith('data-test') ||
				KNOWN_ATTRIBUTES_THAT_DOES_NOT_CAUSE_LAYOUT_SHIFTS.includes(attributeName) ||
				NON_VISUAL_ARIA_ATTRIBUTES.includes(attributeName) ||
				THIRD_PARTY_BROWSER_EXTENSION_ATTRIBUTES.includes(attributeName)
			) {
				return false;
			}

			return true;
		}

		return getConsideredEntryTypes().includes(entry.data.type);
	}
}
