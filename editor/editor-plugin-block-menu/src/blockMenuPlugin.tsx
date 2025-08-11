import React from 'react';

import type { BlockMenuPlugin, RegisterBlockMenuComponent } from './blockMenuPluginType';
import { createBlockMenuRegistry } from './editor-actions';
import { createPlugin } from './pm-plugins/main';
import BlockMenu from './ui/block-menu';
import { getBlockMenuComponents } from './ui/block-menu-components';

export const blockMenuPlugin: BlockMenuPlugin = ({ api }) => {
	const registry = createBlockMenuRegistry();
	registry.register(getBlockMenuComponents());
	return {
		name: 'blockMenu',
		pmPlugins() {
			return [
				{
					name: 'blockMenuPlugin',
					plugin: createPlugin,
				},
			];
		},
		actions: {
			registerBlockMenuComponents: (blockMenuComponents: RegisterBlockMenuComponent[]) => {
				registry.register(blockMenuComponents);
			},

			getBlockMenuComponents: () => {
				return registry.components;
			},
		},
		contentComponent({
			editorView,
			popupsMountPoint,
			popupsBoundariesElement,
			popupsScrollableElement,
		}) {
			return (
				<BlockMenu
					editorView={editorView}
					api={api}
					mountTo={popupsMountPoint}
					boundariesElement={popupsBoundariesElement}
					scrollableElement={popupsScrollableElement}
				/>
			);
		},
	};
};
