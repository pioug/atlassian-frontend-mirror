import React from 'react';

import {
	BLOCK_ACTIONS_MENU_SECTION,
	BLOCK_ACTIONS_FEATURED_EXTENSION_SLOT_MENU_ITEM,
	BLOCK_ACTIONS_MENU_SECTION_RANK,
	TRANSFORM_CREATE_MENU_SECTION,
	TRANSFORM_CREATE_MENU_SECTION_RANK,
	TRANSFORM_DEFAULT_EXTENSION_SLOT_MENU_ITEM,
} from '@atlaskit/editor-common/block-menu';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { SelectionExtensionPlugin } from '../../selectionExtensionPluginType';
import type { ExtensionConfiguration } from '../../types';
import { SelectionExtensionMenuItems } from '../menu/SelectionExtensionMenuItems';
import { SelectionExtensionComponentContextProvider } from '../SelectionExtensionComponentContext';

type RegisterBlockMenuItemsOptions = {
	api: ExtractInjectionAPI<SelectionExtensionPlugin> | undefined;
	editorViewRef?: { current?: EditorView };
	extensionList: ExtensionConfiguration[];
};

export function registerBlockMenuItems({
	extensionList,
	api,
	editorViewRef,
}: RegisterBlockMenuItemsOptions): void {
	extensionList.forEach(({ source, key, blockMenu }) => {
		if (source !== 'first-party' || !blockMenu) {
			return;
		}

		if (!api?.blockMenu) {
			return;
		}

		const componentsToRegister = [];

		// Use placement from BlockMenuExtensionConfiguration
		// Featured placement: register under TRANSFORM_MENU_SECTION
		// Default placement: register under TRANSFORM_CREATE_MENU_SECTION
		if (blockMenu.placement === 'featured') {
			componentsToRegister.push({
				type: 'block-menu-item' as const,
				key: `selection-extension-${key}`,
				parent: {
					type: 'block-menu-section' as const,
					key: BLOCK_ACTIONS_MENU_SECTION.key,
					rank: BLOCK_ACTIONS_MENU_SECTION_RANK[
						BLOCK_ACTIONS_FEATURED_EXTENSION_SLOT_MENU_ITEM.key
					],
				},
				component: () => {
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
				},
			});
		} else {
			componentsToRegister.push({
				type: 'block-menu-item' as const,
				key: `selection-extension-${key}`,
				isHidden: () => blockMenu.getMenuItems().length === 0,
				parent: {
					type: 'block-menu-section' as const,
					key: TRANSFORM_CREATE_MENU_SECTION.key,
					rank: TRANSFORM_CREATE_MENU_SECTION_RANK[TRANSFORM_DEFAULT_EXTENSION_SLOT_MENU_ITEM.key],
				},
				component: () => {
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
				},
			});
		}

		if (componentsToRegister.length > 0) {
			api.blockMenu.actions.registerBlockMenuComponents(componentsToRegister);
		}
	});
}
