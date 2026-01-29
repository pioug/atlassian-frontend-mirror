import React from 'react';

import type { NodeType } from '@atlaskit/editor-prosemirror/model';

import type { BlockMenuPlugin, RegisterBlockMenuComponent } from './blockMenuPluginType';
import { createBlockMenuRegistry } from './editor-actions';
import { isTransformToTargetDisabled } from './editor-actions/isTransformToTargetDisabled';
import { formatNode } from './editor-commands/formatNode';
import { transformNode } from './editor-commands/transformNode';
import type {
	FormatNodeAnalyticsAttrs,
	FormatNodeTargetType,
	TransformNodeMetadata,
} from './editor-commands/transforms/types';
import { getBlockMenuExperiencesPlugin } from './pm-plugins/experiences/block-menu-experiences';
import { keymapPlugin } from './pm-plugins/keymap';
import { blockMenuPluginKey, createPlugin } from './pm-plugins/main';
import BlockMenu from './ui/block-menu';
import { getBlockMenuComponents } from './ui/block-menu-components';
import { BlockMenuProvider } from './ui/block-menu-provider';
import { Flag } from './ui/flag';

export const blockMenuPlugin: BlockMenuPlugin = ({ api, config }) => {
	const registry = createBlockMenuRegistry();
	registry.register(getBlockMenuComponents({ api, config }));

	const refs: {
		popupsMountPoint?: HTMLElement;
	} = {};

	return {
		name: 'blockMenu',
		pmPlugins() {
			return [
				{
					name: 'blockMenuPlugin',
					plugin: () => createPlugin(api),
				},
				{
					name: 'blockMenuKeymap',
					plugin: () => keymapPlugin(api, config),
				},
				{
					name: 'blockMenuExperiences',
					plugin: () =>
						getBlockMenuExperiencesPlugin({
							refs,
							dispatchAnalyticsEvent: (payload) =>
								api?.analytics?.actions?.fireAnalyticsEvent(payload),
						}),
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

			isTransformOptionDisabled: (
				optionNodeTypeName: string,
				optionNodeTypeAttrs?: Record<string, unknown>,
			) => {
				const preservedSelection =
					api?.blockControls?.sharedState.currentState()?.preservedSelection;
				const selection = api?.selection?.sharedState?.currentState()?.selection;

				const currentSelection = preservedSelection || selection;
				if (!currentSelection) {
					return true;
				}

				return isTransformToTargetDisabled({
					selection: currentSelection,
					targetNodeTypeName: optionNodeTypeName,
					targetNodeTypeAttrs: optionNodeTypeAttrs,
				});
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
			refs.popupsMountPoint = popupsMountPoint || undefined;

			return (
				<BlockMenuProvider api={api} editorView={editorView}>
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
