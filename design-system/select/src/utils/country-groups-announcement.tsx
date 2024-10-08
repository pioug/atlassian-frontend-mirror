import { type AriaOnFocusProps, type OptionsOrGroups } from '@atlaskit/react-select';

import { type GroupType } from '../types';

type Country = {
	icon: string;
	name: string;
	abbr: string;
	code: string | number;
};

export type CountyGroupOptions = {
	label: string;
	options: Country[];
};

// Used for overwriting ariaLiveMessages builtin onFocus method.
// Returns custom built string while focusing each group option. This string is used for screen reader announcement.
export function onCountryOptionFocus(
	onFocusProps: AriaOnFocusProps<Country, GroupType<Country>>,
	defaultOptions?: CountyGroupOptions[],
) {
	const { focused } = onFocusProps;
	const isOptionFocused = (option: Country) => {
		return option.name === focused.name;
	};
	const groupData = defaultOptions?.find((option) => {
		return option.options?.some(isOptionFocused);
	});

	const groupOptionIndex = groupData?.options.findIndex(isOptionFocused) ?? 0;

	return `Option ${focused.name} (${focused.abbr.toUpperCase()}) +${focused.code}, ${groupData?.label} group, item ${
		groupOptionIndex + 1
	} out of ${groupData?.options.length}. All in all `;
}

// Helper function which identifies if options are grouped.
export const isCountryOptionsGrouped = (arr?: OptionsOrGroups<Country, GroupType<Country>>) => {
	return arr?.every((obj) => obj.hasOwnProperty('options'));
};
