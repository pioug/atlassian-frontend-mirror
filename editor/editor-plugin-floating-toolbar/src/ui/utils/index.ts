import {
	Command,
	FloatingToolbarOverflowDropdown,
	FloatingToolbarOverflowDropdownOptions,
	OverflowDropdownOption,
} from '@atlaskit/editor-common/types';

// if there are more than 1 item with type `overflow-dropdown`, we should only show one and combine the options
export const consolidateOverflowDropdownItems = (
	overflowDropdowns: FloatingToolbarOverflowDropdown<Command>[],
): FloatingToolbarOverflowDropdown<Command> => {
	if (overflowDropdowns.length <= 1) {
		return overflowDropdowns[0];
	}
	const combinedItems = overflowDropdowns.reduce<FloatingToolbarOverflowDropdownOptions<Command>>(
		(acc, item) => {
			if (item.options) {
				acc.push(...item.options);
			}
			return acc;
		},
		[],
	);

	// To filter out items that have a rank property, sort them by rank in descending order (highest rank first)
	const rankedItems = combinedItems
		.filter(
			(item): item is OverflowDropdownOption<Command> =>
				'rank' in item && typeof item.rank === 'number',
		)
		.sort((a, b) => (b.rank || 0) - (a.rank || 0));

	const unrankedItems = combinedItems.filter(
		(item): item is OverflowDropdownOption<Command> =>
			!('rank' in item && typeof item.rank === 'number'),
	);

	const sortedItems = [...rankedItems, ...unrankedItems];

	const largestDropdownWidth = overflowDropdowns.reduce((acc, item) => {
		if (item.dropdownWidth && item.dropdownWidth > acc) {
			return item.dropdownWidth;
		}
		return acc;
	}, 0);

	return {
		type: 'overflow-dropdown',
		dropdownWidth: largestDropdownWidth,
		options: sortedItems,
	};
};
