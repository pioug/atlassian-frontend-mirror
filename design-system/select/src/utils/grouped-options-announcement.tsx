import { fg } from '@atlaskit/platform-feature-flags';
import {
	type AriaOnFocusProps,
	type GroupBase,
	type OptionsOrGroups,
} from '@atlaskit/react-select';

import { type GroupType, type OptionType } from '../types';

// Used for overwriting ariaLiveMessages builtin onFocus method.
// Returns custom built string while focusing each group option. This string is used for screen reader announcement.
export function onFocus(
	onFocusProps: AriaOnFocusProps<OptionType, GroupBase<OptionType>>,
	defaultOptions?: OptionsOrGroups<OptionType, GroupType<OptionType>>,
) {
	const { focused } = onFocusProps;
	const isOptionFocused = (option: OptionType) => {
		return option.label === focused.label;
	};
	const groupData = defaultOptions?.find((option) => {
		return option.options?.some(isOptionFocused);
	});

	const groupOptionIndex = groupData?.options.findIndex(isOptionFocused) ?? 0;

	if (focused.label && groupData?.label && fg('design_system_select-a11y-improvement')) {
		return `${focused.label}, ${groupData?.label}`;
	}

	return `Option ${focused.label}, ${groupData?.label} group, item ${
		groupOptionIndex + 1
	} out of ${groupData?.options.length}. All in all `;
}

// Helper function which identifies if options are grouped.
export const isOptionsGrouped = (
	arr: OptionsOrGroups<OptionType, GroupType<OptionType>> | undefined,
) => {
	return arr?.every((obj) => obj.hasOwnProperty('options'));
};

// Helper function which calculates how many options are in total in all groups.
export const countAllOptions = (groupsArray: readonly GroupType<OptionType>[]) => {
	const totalLength = groupsArray?.reduce((acc: number, currentGroup) => {
		const group = currentGroup as GroupType<OptionType>;
		acc += group?.options?.length;
		return acc;
	}, 0);
	return totalLength;
};
