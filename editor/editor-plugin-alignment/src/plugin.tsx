import React from 'react';

import { alignment } from '@atlaskit/adf-schema';
import type {
	NextEditorPlugin,
	OptionalPlugin,
	ToolbarUIComponentFactory,
} from '@atlaskit/editor-common/types';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';

import { keymapPlugin } from './pm-plugins/keymap';
import { createPlugin, pluginKey } from './pm-plugins/main';
import type { AlignmentPluginState } from './pm-plugins/types';
import { PrimaryToolbarComponent } from './ui/PrimaryToolbarComponent';

export const defaultConfig: AlignmentPluginState = {
	align: 'start',
};

export type AlignmentPlugin = NextEditorPlugin<
	'alignment',
	{
		sharedState: AlignmentPluginState | undefined;
		dependencies: [OptionalPlugin<PrimaryToolbarPlugin>];
	}
>;

export const alignmentPlugin: AlignmentPlugin = ({ api }) => {
	const primaryToolbarComponent: ToolbarUIComponentFactory = ({
		editorView,
		popupsMountPoint,
		popupsBoundariesElement,
		popupsScrollableElement,
		disabled,
		isToolbarReducedSpacing,
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
			/>
		);
	};

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
					plugin: () => keymapPlugin(),
				},
			];
		},

		usePluginHook: () => {
			api?.core?.actions.execute(
				api?.primaryToolbar?.commands.registerComponent({
					name: 'alignment',
					component: primaryToolbarComponent,
				}),
			);
		},

		primaryToolbarComponent: !api?.primaryToolbar ? primaryToolbarComponent : undefined,
	};
};
