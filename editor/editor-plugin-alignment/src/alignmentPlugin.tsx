import React from 'react';

import { alignment } from '@atlaskit/adf-schema';
import type {
	Command,
	FloatingToolbarCustom,
	ToolbarUIComponentFactory,
} from '@atlaskit/editor-common/types';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { AlignmentPlugin } from './alignmentPluginType';
import { keymapPlugin } from './pm-plugins/keymap';
import { createPlugin, pluginKey } from './pm-plugins/main';
import type { AlignmentPluginState } from './pm-plugins/types';
import { FloatingToolbarComponent } from './ui/FloatingToolbarComponent';
import { PrimaryToolbarComponent } from './ui/PrimaryToolbarComponent';

export const defaultConfig: AlignmentPluginState = {
	align: 'start',
};

export const alignmentPlugin: AlignmentPlugin = ({ api }) => {
	const primaryToolbarComponent: ToolbarUIComponentFactory = ({
		editorView,
		popupsMountPoint,
		popupsBoundariesElement,
		popupsScrollableElement,
		disabled,
		isToolbarReducedSpacing,
		toolbarSize,
	}) => {
		return (
			<PrimaryToolbarComponent
				api={api}
				editorView={editorView}
				disabled={disabled}
				popupsMountPoint={popupsMountPoint}
				popupsBoundariesElement={popupsBoundariesElement}
				popupsScrollableElement={popupsScrollableElement}
				isToolbarReducedSpacing={isToolbarReducedSpacing}
				toolbarSize={toolbarSize}
			/>
		);
	};

	api?.primaryToolbar?.actions.registerComponent({
		name: 'alignment',
		component: primaryToolbarComponent,
	});

	return {
		name: 'alignment',

		marks() {
			return [{ name: 'alignment', mark: alignment }];
		},

		getSharedState(editorState) {
			if (!editorState) {
				return undefined;
			}
			const pluginState = pluginKey.getState(editorState);
			return pluginState
				? {
						align: pluginState.align,
						isEnabled: pluginState.isEnabled,
					}
				: undefined;
		},

		pmPlugins() {
			return [
				{
					name: 'alignmentPlugin',
					plugin: ({ dispatch }) => createPlugin(dispatch, defaultConfig),
				},
				{
					name: 'annotationKeymap',
					plugin: () => keymapPlugin(api),
				},
			];
		},

		pluginsOptions: {
			selectionToolbar: () => {
				if (
					api?.selectionToolbar?.sharedState?.currentState()?.toolbarDocking === 'none' &&
					editorExperiment('platform_editor_controls', 'variant1', { exposure: true })
				) {
					const toolbarCustom: FloatingToolbarCustom<Command> = {
						type: 'custom',
						render: (view) => {
							if (!view) {
								return;
							}

							return <FloatingToolbarComponent api={api} editorView={view} />;
						},
						fallback: [],
					};

					return {
						isToolbarAbove: true,
						items: [toolbarCustom],
						rank: 4,
						pluginName: 'alignment',
					};
				} else {
					return undefined;
				}
			},
		},

		primaryToolbarComponent: !api?.primaryToolbar ? primaryToolbarComponent : undefined,
	};
};
