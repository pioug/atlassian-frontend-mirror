import React from 'react';

import type { NodeType } from '@atlaskit/editor-prosemirror/model';

import type { BlockMenuPlugin, RegisterBlockMenuComponent } from './blockMenuPluginType';
import { createBlockMenuRegistry } from './editor-actions';
import { formatNode } from './editor-commands/formatNode';
import { transformNode } from './editor-commands/transformNode';
import type {
	FormatNodeTargetType,
	FormatNodeAnalyticsAttrs,
	TransformNodeMetadata,
} from './editor-commands/transforms/types';
import { blockMenuPluginKey, createPlugin } from './pm-plugins/main';
import BlockMenu from './ui/block-menu';
import { getBlockMenuComponents } from './ui/block-menu-components';
import { BlockMenuProvider } from './ui/block-menu-provider';
import { Flag } from './ui/flag';

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
			transformNode: (targetType: NodeType, metadata?: TransformNodeMetadata) => {
				return transformNode(api)(targetType, metadata);
			},
		},
		getSharedState(editorState) {
			if (!editorState) {
				return {
					currentSelectedNodeName: undefined,
					showFlag: false,
				};
			}

			// Get the menuTriggerBy from blockControls plugin if available
			const currentSelectedNodeName = api?.blockControls?.sharedState.currentState()?.menuTriggerBy;

			// Get the showFlag from plugin state
			const pluginState = blockMenuPluginKey.getState(editorState);
			const showFlag = pluginState?.showFlag ?? false;

			return {
				currentSelectedNodeName,
				showFlag,
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
					<Flag api={api} />
				</BlockMenuProvider>
			);
		},
	};
};
