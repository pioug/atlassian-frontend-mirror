import {
	type Command,
	type FloatingToolbarOverflowDropdownOptions,
} from '@atlaskit/editor-common/types';

export const selectionToolbar = (options: FloatingToolbarOverflowDropdownOptions<Command>) => ({
	isToolbarAbove: true,
	items: [
		{
			type: 'separator' as const,
			fullHeight: true,
			supportsViewMode: true,
		},
		{
			type: 'overflow-dropdown' as const,
			dropdownWidth: 240,
			supportsViewMode: true,
			options,
		},
	],
	rank: -6,
});
