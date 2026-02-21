import {
	type AriaOnFocusProps,
	type GroupBase,
	type OptionsOrGroups,
} from '@atlaskit/react-select';

import { type GroupType, type OptionType } from '../types';

export function generateGroupLabel(
	onFocusProps: AriaOnFocusProps<OptionType, GroupBase<OptionType>>,
	defaultOptions?: OptionsOrGroups<OptionType, GroupType<OptionType>>,
): string {
	const { focused } = onFocusProps;
	const isOptionFocused = (option: OptionType) => {
		return option.label === focused.label;
	};
	const groupData = defaultOptions?.find((option) => {
		return option.options?.some(isOptionFocused);
	});

	const groupOptionIndex = groupData?.options.findIndex(isOptionFocused) ?? 0;
	const totalLength = countAllOptions(defaultOptions as readonly GroupType<OptionType>[]);

	return `${focused.label}, ${groupData?.label} (${groupOptionIndex + 1} of ${totalLength})`;
}

// Helper function which identifies if options are grouped.
export const isOptionsGrouped: (
	arr: OptionsOrGroups<OptionType, GroupType<OptionType>> | undefined,
) => boolean | undefined = (
	arr: OptionsOrGroups<OptionType, GroupType<OptionType>> | undefined,
) => {
	return arr?.every((obj) => obj.hasOwnProperty('options'));
};

// Helper function which calculates how many options are in total in all groups.
export const countAllOptions: (groupsArray: readonly GroupType<OptionType>[]) => number = (
	groupsArray: readonly GroupType<OptionType>[],
) => {
	const totalLength = groupsArray?.reduce((acc: number, currentGroup) => {
		const group = currentGroup as GroupType<OptionType>;
		acc += group?.options?.length;
		return acc;
	}, 0);
	return totalLength;
};
