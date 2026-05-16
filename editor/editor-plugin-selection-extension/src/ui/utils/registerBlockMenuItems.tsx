import React from 'react';

import {
	TRANSFORM_MENU_SECTION,
	TRANSFORM_MENU_SECTION_RANK,
	BLOCK_ACTIONS_FEATURED_EXTENSION_SLOT_MENU_ITEM,
	BLOCK_ACTIONS_FEATURED_EXTENSION_ITEM_RANK,
	MAIN_BLOCK_MENU_SECTION_RANK,
	TRANSFORM_CREATE_MENU_SECTION,
	TRANSFORM_CREATE_MENU_SECTION_RANK,
	TRANSFORM_DEFAULT_EXTENSION_SLOT_MENU_ITEM,
} from '@atlaskit/editor-common/block-menu';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterBlockMenuComponent } from '@atlaskit/editor-plugin-block-menu';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';
import { fg } from '@atlaskit/platform-feature-flags';

import type { SelectionExtensionPlugin } from '../../selectionExtensionPluginType';
import type { ExtensionConfiguration } from '../../types';
import { SelectionExtensionMenuItems } from '../menu/SelectionExtensionMenuItems';
import { SelectionExtensionComponentContextProvider } from '../SelectionExtensionComponentContext';

type RegisterBlockMenuItemsOptions = {
	api: ExtractInjectionAPI<SelectionExtensionPlugin> | undefined;
	editorViewRef?: { current?: EditorView };
	extensionList: ExtensionConfiguration[];
};

/**
 * Registers first-party selection extension menu items with the block menu plugin.
 */
export function registerBlockMenuItems({
	extensionList,
	api,
	editorViewRef,
}: RegisterBlockMenuItemsOptions): void {
	const componentsToRegister: RegisterBlockMenuComponent[] = [];
	const registeredFeaturedSectionKeys = new Set<string>();

	extensionList.forEach(({ source, key, blockMenu }) => {
		if (source !== 'first-party' || !blockMenu) {
			return;
		}

		if (!api?.blockMenu) {
			return;
		}

		/**
		 * Renders the registered selection-extension menu items with the correct block-menu context.
		 */
		const makeItemComponent = () => {
			const editorView = editorViewRef?.current;
			if (!editorView) {
				return null;
			}
			return (
				<SelectionExtensionComponentContextProvider
					// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
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

		if (blockMenu.placement === 'featured-section' && fg('platform_editor_block_menu_v2_patch_2')) {
			// Block menu sections do not support isHidden. Check menu items before registering
			// the section to avoid rendering an orphan separator when there are no items.
			if (blockMenu.getMenuItems().length === 0 || !blockMenu.sectionKey) {
				return;
			}

			const sectionRank = (MAIN_BLOCK_MENU_SECTION_RANK as Record<string, number>)[
				blockMenu.sectionKey
			];

			if (sectionRank === undefined) {
				return;
			}

			// Register as its own top-level section with a separator
			if (!registeredFeaturedSectionKeys.has(blockMenu.sectionKey)) {
				componentsToRegister.push({
					type: 'block-menu-section' as const,
					key: blockMenu.sectionKey,
					rank: sectionRank,
					component: ({ children }: { children: React.ReactNode }) => (
						<ToolbarDropdownItemSection hasSeparator>{children}</ToolbarDropdownItemSection>
					),
				});
				registeredFeaturedSectionKeys.add(blockMenu.sectionKey);
			}
			componentsToRegister.push({
				type: 'block-menu-item' as const,
				key: `selection-extension-${key}`,
				parent: {
					type: 'block-menu-section' as const,
					key: blockMenu.sectionKey,
					rank: BLOCK_ACTIONS_FEATURED_EXTENSION_ITEM_RANK[
						BLOCK_ACTIONS_FEATURED_EXTENSION_SLOT_MENU_ITEM.key
					],
				},
				component: makeItemComponent,
			});
		} else if (
			blockMenu.placement === 'featured' ||
			(blockMenu.placement === 'featured-section' && !fg('platform_editor_block_menu_v2_patch_2'))
		) {
			// Register as an item directly under TRANSFORM_MENU_SECTION
			// (also used as fallback for featured-section when gate is off)
			componentsToRegister.push({
				type: 'block-menu-item' as const,
				key: `selection-extension-${key}`,
				parent: {
					type: 'block-menu-section' as const,
					key: TRANSFORM_MENU_SECTION.key,
					rank: (TRANSFORM_MENU_SECTION_RANK as Record<string, number>)[
						BLOCK_ACTIONS_FEATURED_EXTENSION_SLOT_MENU_ITEM.key
					],
				},
				component: makeItemComponent,
			});
		} else {
			// Default: register under TRANSFORM_CREATE_MENU_SECTION
			componentsToRegister.push({
				type: 'block-menu-item' as const,
				key: `selection-extension-${key}`,
				isHidden: () => blockMenu.getMenuItems().length === 0,
				parent: {
					type: 'block-menu-section' as const,
					key: TRANSFORM_CREATE_MENU_SECTION.key,
					rank: (TRANSFORM_CREATE_MENU_SECTION_RANK as Record<string, number>)[
						TRANSFORM_DEFAULT_EXTENSION_SLOT_MENU_ITEM.key
					],
				},
				component: makeItemComponent,
			});
		}
	});

	if (componentsToRegister.length > 0) {
		api?.blockMenu?.actions.registerBlockMenuComponents(componentsToRegister);
	}
}
