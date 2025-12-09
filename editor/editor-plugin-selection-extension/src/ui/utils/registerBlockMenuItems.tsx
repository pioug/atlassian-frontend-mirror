import React from 'react';

import {
	TRANSFORM_CREATE_MENU_SECTION,
	TRANSFORM_MENU_ITEM_RANK,
} from '@atlaskit/editor-common/block-menu';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { SelectionExtensionPlugin } from '../../selectionExtensionPluginType';
import type { ExtensionConfiguration } from '../../types';
import { SelectionExtensionMenuItems } from '../menu/SelectionExtensionMenuItems';

export function registerBlockMenuItems(
	extensionList: ExtensionConfiguration[],
	api: ExtractInjectionAPI<SelectionExtensionPlugin> | undefined,
) {
	extensionList.forEach(({ source, key, blockMenu }) => {
		if (source !== 'first-party' || !blockMenu) {
			return;
		}

		api?.blockMenu?.actions.registerBlockMenuComponents([
			{
				type: 'block-menu-item' as const,
				key: `selection-extension-${key}`,
				parent: {
					type: 'block-menu-section' as const,
					key: TRANSFORM_CREATE_MENU_SECTION.key,
					rank: TRANSFORM_MENU_ITEM_RANK[TRANSFORM_CREATE_MENU_SECTION.key],
				},
				component: () => {
					return <SelectionExtensionMenuItems getMenuItems={blockMenu.getMenuItems} />;
				},
			},
		]);
	});
}
