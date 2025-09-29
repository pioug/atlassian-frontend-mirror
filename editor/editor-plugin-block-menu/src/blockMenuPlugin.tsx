import React from 'react';

import type { BlockMenuPlugin, RegisterBlockMenuComponent } from './blockMenuPluginType';
import { createBlockMenuRegistry } from './editor-actions';
import { formatNode } from './editor-commands/formatNode';
import type {
	FormatNodeTargetType,
	FormatNodeAnalyticsAttrs,
} from './editor-commands/transforms/types';
import { createPlugin } from './pm-plugins/main';
import BlockMenu from './ui/block-menu';
import { getBlockMenuComponents } from './ui/block-menu-components';
import { BlockMenuProvider } from './ui/block-menu-provider';

export const blockMenuPlugin: BlockMenuPlugin = ({ api, config }) => {
	const registry = createBlockMenuRegistry();
	registry.register(getBlockMenuComponents({ api, config }));

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
		commands: {
			formatNode: (targetType: FormatNodeTargetType, analyticsAttrs?: FormatNodeAnalyticsAttrs) => {
				return formatNode(api)(targetType, analyticsAttrs);
			},
		},
		getSharedState(editorState) {
			if (!editorState) {
				return {
					currentSelectedNodeName: undefined,
				};
			}

			// Get the menuTriggerBy from blockControls plugin if available
			const currentSelectedNodeName = api?.blockControls?.sharedState.currentState()?.menuTriggerBy;

			return {
				currentSelectedNodeName,
			};
		},
		contentComponent({
			editorView,
			popupsMountPoint,
			popupsBoundariesElement,
			popupsScrollableElement,
		}) {
			return (
				<BlockMenuProvider api={api}>
					<BlockMenu
						editorView={editorView}
						api={api}
						mountTo={popupsMountPoint}
						boundariesElement={popupsBoundariesElement}
						scrollableElement={popupsScrollableElement}
					/>
				</BlockMenuProvider>
			);
		},
	};
};
