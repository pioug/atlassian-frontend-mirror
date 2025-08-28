import React from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';

import type { SelectionExtensionPlugin } from '../../selectionExtensionPluginType';
import type { ExtensionConfiguration } from '../../types';
import { getBlockMenuItemExtensions } from '../extensions';

export function registerBlockMenuItems(
	extensionList: ExtensionConfiguration[],
	api: ExtractInjectionAPI<SelectionExtensionPlugin> | undefined,
) {
	const blockMenuExtensions = getBlockMenuItemExtensions(extensionList, 'first-party');
	if (!blockMenuExtensions?.length) {
		return;
	}
	blockMenuExtensions.forEach((extension, index) => {
		const menuItem = extension.menuItem;

		const blockMenuItemKey = `selection-extension-${index}`;

		const blockMenuComponent = [
			{
				type: 'block-menu-item' as const,
				key: blockMenuItemKey,
				parent: {
					type: 'block-menu-section' as const,
					key: 'block-menu-section-primary',
					rank: 200,
				},
				component: () => {
					return (
						<ToolbarDropdownItem
							elemBefore={menuItem.icon ? React.createElement(menuItem.icon) : undefined}
						>
							{menuItem.label}
						</ToolbarDropdownItem>
					);
				},
			},
		];
		api?.blockMenu?.actions.registerBlockMenuComponents(blockMenuComponent);
	});
}
