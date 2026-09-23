import React from 'react';

import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { UNSAFE_expValNoExposure } from '@atlaskit/platform-feature-experiments/unsafe-exp-val-no-exposure';

import type { BlockMenuPlugin, RegisterBlockMenuComponent } from './blockMenuPluginType';
import { createBlockMenuRegistry } from './editor-actions';
import { isTransformToTargetDisabled } from './editor-actions/isTransformToTargetDisabled';
import { createBlockMenuTransformSourceRegistry } from './editor-actions/transformSourceRegistry';
import { transformInlineNode } from './editor-commands/transformInlineNode';
import { transformNode } from './editor-commands/transformNode';
import type {
	TransformInlineNodeMetadata,
	TransformNodeMarkChanges,
	TransformNodeMetadata,
} from './editor-commands/types';
import { getBlockMenuExperiencesPlugin } from './pm-plugins/experiences/block-menu-experiences';
import { keymapPlugin } from './pm-plugins/keymap';
import { blockMenuPluginKey, createPlugin } from './pm-plugins/main';
import BlockMenu from './ui/block-menu';
import { getBlockMenuComponents } from './ui/block-menu-components';
import { BlockMenuProvider } from './ui/block-menu-provider';
import { Flag } from './ui/flag';

export const blockMenuPlugin: BlockMenuPlugin = ({ api, config }) => {
	const registry = createBlockMenuRegistry();
	const transformSourceRegistry = createBlockMenuTransformSourceRegistry();
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
				...(UNSAFE_expValNoExposure(
					'platform_editor_experience_tracking_observer',
					'isEnabled',
					false,
				)
					? [
							{
								name: 'blockMenuExperiences',
								plugin: () =>
									getBlockMenuExperiencesPlugin({
										refs,
										dispatchAnalyticsEvent: (payload) =>
											api?.analytics?.actions?.fireAnalyticsEvent(payload),
									}),
							},
						]
					: []),
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
				targetNodeMarkChanges?: TransformNodeMarkChanges,
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
					targetNodeMarkChanges: isExperimentEnabled('platform_editor_block_menu_small_text')
						? targetNodeMarkChanges
						: undefined,
					transformRegistry: transformSourceRegistry,
				});
			},
			registerBlockMenuTransforms: (transforms) => transformSourceRegistry.register(transforms),
		},
		commands: {
			transformInlineNode: (metadata: TransformInlineNodeMetadata) =>
				transformInlineNode(api)(metadata),
			transformNode: (targetType: NodeType, metadata?: TransformNodeMetadata) =>
				transformNode(api, transformSourceRegistry)(targetType, metadata),
		},
		getSharedState(editorState) {
			const useStandardNodeWidth = config?.useStandardNodeWidth ?? false;

			if (!editorState) {
				return {
					currentSelectedNodeName: undefined,
					showFlag: false,
					useStandardNodeWidth,
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
				useStandardNodeWidth,
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
