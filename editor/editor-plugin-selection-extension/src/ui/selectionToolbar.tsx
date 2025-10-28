import React from 'react';

import type {
	Command,
	FloatingToolbarCustom,
	FloatingToolbarOverflowDropdownOptions,
	SelectionToolbarGroup,
} from '@atlaskit/editor-common/types';

import type { ExtensionConfiguration } from '../types';

import { getToolbarItemExtensions } from './extensions';
import { LegacyExtensionToolbarItem } from './LegacyToolbarComponent';

type SelectionToolbarOptions = {
	extensionList?: ExtensionConfiguration[];
	overflowOptions: FloatingToolbarOverflowDropdownOptions<Command>;
};

export const selectionToolbar = ({
	overflowOptions,
	extensionList = [],
}: SelectionToolbarOptions): SelectionToolbarGroup => {
	const inlineToolbarItemExtensions = getToolbarItemExtensions(extensionList, 'inlineToolbar');

	return {
		items: [
			...(inlineToolbarItemExtensions.length
				? [
						{
							type: 'separator' as const,
							fullHeight: true,
							supportsViewMode: true,
						},
						...inlineToolbarItemExtensions.map<FloatingToolbarCustom<Command>>(
							({ getToolbarItem, getMenuItems }) => ({
								type: 'custom' as const,
								render: () => (
									<LegacyExtensionToolbarItem
										toolbarItem={getToolbarItem()}
										getMenuItems={getMenuItems}
									/>
								),
								fallback: [],
								supportsViewMode: true,
							}),
						),
					]
				: []),
			{
				type: 'separator' as const,
				fullHeight: true,
				supportsViewMode: true,
			},
			{
				type: 'overflow-dropdown' as const,
				dropdownWidth: 240,
				supportsViewMode: true,
				options: overflowOptions,
			},
		],
		rank: -6,
	};
};
