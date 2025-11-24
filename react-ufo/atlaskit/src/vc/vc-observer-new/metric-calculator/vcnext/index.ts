import { fg } from '@atlaskit/platform-feature-flags';

import type { VCObserverEntry, VCObserverEntryType } from '../../types';
import VCCalculator_FY25_03 from '../fy25_03';

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

		return getConsideredEntryTypes().includes(entry.data.type);
	}
}
