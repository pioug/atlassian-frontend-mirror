import React from 'react';

import {
	TRANSFORM_CREATE_MENU_SECTION,
	TRANSFORM_MENU_ITEM_RANK,
} from '@atlaskit/editor-common/block-menu';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { SelectionExtensionPlugin } from '../../selectionExtensionPluginType';
import type { ExtensionConfiguration } from '../../types';
import { SelectionExtensionMenuItems } from '../menu/SelectionExtensionMenuItems';
import { SelectionExtensionComponentContextProvider } from '../SelectionExtensionComponentContext';

type RegisterBlockMenuItemsOptions = {
	extensionList: ExtensionConfiguration[];
	api: ExtractInjectionAPI<SelectionExtensionPlugin> | undefined;
	editorViewRef?: { current?: EditorView };
};

export function registerBlockMenuItems({
	extensionList,
	api,
	editorViewRef,
}: RegisterBlockMenuItemsOptions) {
	extensionList.forEach(({ source, key, blockMenu }) => {
		if (source !== 'first-party' || !blockMenu) {
			return;
		}

		if (!api?.blockMenu) {
			return;
		}

		const component = () => {
			const editorView = editorViewRef?.current;

			if (!editorView) {
				return null;
			}

			return (
				<SelectionExtensionComponentContextProvider
					value={{
						api,
						editorView,
						extensionKey: key,
						extensionSource: source,
						extensionLocation: 'block-menu',
					}}
				>
					<SelectionExtensionMenuItems getMenuItems={blockMenu.getMenuItems} />
				</SelectionExtensionComponentContextProvider>
			);
		};

		api.blockMenu.actions.registerBlockMenuComponents([
			{
				type: 'block-menu-item' as const,
				key: `selection-extension-${key}`,
				parent: {
					type: 'block-menu-section' as const,
					key: TRANSFORM_CREATE_MENU_SECTION.key,
					rank: TRANSFORM_MENU_ITEM_RANK[TRANSFORM_CREATE_MENU_SECTION.key],
				},
				component,
			},
		]);
	});
}
