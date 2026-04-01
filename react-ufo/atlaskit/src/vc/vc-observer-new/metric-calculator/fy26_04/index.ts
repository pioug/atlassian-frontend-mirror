import { fg } from '@atlaskit/platform-feature-flags';

import type { VCObserverEntry, VCObserverEntryType, ViewportEntryData } from '../../types';
import VCCalculator_FY25_03 from '../fy25_03';
import {
	DARK_READER_BROWSER_EXTENSION_ATTRIBUTES,
	MORE_THIRD_PARTY_EXTENSION_ATTRIBUTES,
	KNOWN_ATTRIBUTES_THAT_DOES_NOT_CAUSE_LAYOUT_SHIFTS,
	NON_VISUAL_ARIA_ATTRIBUTES,
	THIRD_PARTY_BROWSER_EXTENSION_ATTRIBUTES,
} from '../utils/constants';

const getConsideredEntryTypes = () => {
	const consideredEntryTypes: VCObserverEntryType[] = [
		'mutation:display-contents-children-element',
	];

	consideredEntryTypes.push('mutation:display-contents-children-attribute');

	return consideredEntryTypes;
};

const getExcludedEntryTypes = () => {
	const excludedEntryTypes: VCObserverEntryType[] = [
		'layout-shift:same-rect',
		'mutation:attribute:non-visual-input-name',
	];

	return excludedEntryTypes;
};

const fy26_04_excluded_attributes = [
	'data-is-hovered', // non-visual attribute
];

export default class VCCalculator_FY26_04 extends VCCalculator_FY25_03 {
	constructor(revisionNo: string = 'fy26.04') {
		super(revisionNo);
	}

	protected isEntryIncluded(
		entry: VCObserverEntry,
		include3p?: boolean,
		excludeSmartAnswersInSearch?: boolean,
	): boolean {
		const extra_fy26_04_excluded_attributes = fg('platform_ufo_ignore_data_fabric_mode')
			? ['data-fabric-mode']
			: [];

		const entryData = entry.data as ViewportEntryData;
		const { attributeName } = entryData;

		if (
			entry.data.type === 'mutation:attribute' &&
			attributeName &&
			extra_fy26_04_excluded_attributes.includes(attributeName)
		) {
			return false;
		}

		const isEntryIncludedInV3 = super.isEntryIncluded(
			entry,
			include3p,
			excludeSmartAnswersInSearch,
		);

		if (isEntryIncludedInV3 && !getExcludedEntryTypes().includes(entry.data.type)) {
			return true;
		}

		if (
			entry.data.type === 'mutation:attribute' &&
			(!attributeName ||
				(fy26_04_excluded_attributes.includes(attributeName) &&
					fg('platform_ufo_data-is-hovered-v4-exclusion')))
		) {
			return false;
		}

		const thirdPartyAttributes = [
			...THIRD_PARTY_BROWSER_EXTENSION_ATTRIBUTES,
			...(fg('platform_ufo_exclude_dark_reader_extension')
				? DARK_READER_BROWSER_EXTENSION_ATTRIBUTES
				: []),
			...(fg('platform_ufo_exclude_fdprocessedid_attribute') ? MORE_THIRD_PARTY_EXTENSION_ATTRIBUTES : []),
		];

		if (entryData.type === 'mutation:display-contents-children-attribute') {
			if (
				!attributeName ||
				attributeName.startsWith('data-test') ||
				KNOWN_ATTRIBUTES_THAT_DOES_NOT_CAUSE_LAYOUT_SHIFTS.includes(attributeName) ||
				NON_VISUAL_ARIA_ATTRIBUTES.includes(attributeName) ||
				thirdPartyAttributes.includes(attributeName)
			) {
				return false;
			}

			return true;
		}

		return getConsideredEntryTypes().includes(entry.data.type);
	}
}
