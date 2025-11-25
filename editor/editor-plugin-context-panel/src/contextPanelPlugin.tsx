import type React from 'react';

import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ContextPanelHandler } from '@atlaskit/editor-common/types';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';

import type { ContextPanelPlugin } from './contextPanelPluginType';
import { applyChange } from './pm-plugins/transforms';
import type { ObjectSidebarBehavior, ObjectSidebarPanel } from './types/object-siderbar-types';

export const pluginKey = new PluginKey<ContextPanelPluginState>('contextPanelPluginKey');

type ContextPanelPluginState = {
	contents: React.ReactNode[];
	handlers: ContextPanelHandler[];
};

function contextPanelPluginFactory(
	contextPanels: Array<ContextPanelHandler>,
	dispatch: Dispatch<ContextPanelPluginState>,
) {
	return new SafePlugin<ContextPanelPluginState>({
		key: pluginKey,
		state: {
			// @ts-ignore - Workaround for help-center local consumption

			init(_config, state) {
				return {
					handlers: contextPanels,
					// @ts-ignore - Workaround for help-center local consumption

					contents: contextPanels.map((panelContent) => panelContent(state)),
				};
			},

			// @ts-ignore - Workaround for help-center local consumption

			apply(tr, pluginState, _oldState, newState) {
				let newPluginState = pluginState;
				const meta = tr.getMeta(pluginKey);

				if (tr.docChanged || tr.selectionSet || (meta && meta.changed)) {
					// @ts-ignore - Workaround for help-center local consumption

					const newContents = pluginState.handlers.map((panelContent) => panelContent(newState));

					const contentsLengthChanged = newContents.length !== newPluginState.contents.length;
					// @ts-ignore - Workaround for help-center local consumption

					const contentChanged = newContents.some(
						// @ts-ignore - Workaround for help-center local consumption

						(node, index) => newPluginState.contents[index] !== node,
					);
					if (contentsLengthChanged || contentChanged) {
						newPluginState = {
							...newPluginState,
							contents: newContents,
						};
					}
				}

				if (newPluginState !== pluginState) {
					dispatch(pluginKey, newPluginState);
				}

				return newPluginState;
			},
		},
	});
}

/**
 * Context panel plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
export const contextPanelPlugin: ContextPanelPlugin = ({ config }) => ({
	name: 'contextPanel',

	actions: {
		applyChange: applyChange,
		showPanel:
			config?.objectSideBar.showPanel && fg('platform_editor_ai_object_sidebar_injection')
				? (panel: ObjectSidebarPanel, behavior?: ObjectSidebarBehavior, panelWidth?: number) =>
						config.objectSideBar.showPanel(panel, behavior, panelWidth)
				: undefined,
		closePanel:
			config?.objectSideBar.closePanel && fg('platform_editor_ai_object_sidebar_injection')
				? () => config.objectSideBar.closePanel()
				: undefined,
		closePanelById:
			config?.objectSideBar.closePanelById && fg('platform_editor_ai_object_sidebar_injection')
				? (id: ObjectSidebarPanel['id']) => config.objectSideBar.closePanelById(id)
				: undefined,
	},

	getSharedState(state) {
		if (!state) {
			return undefined;
		}
		const { contents } = pluginKey.getState(state) ?? {};
		return {
			contents,
		};
	},

	pmPlugins(contextPanels: Array<ContextPanelHandler> = []) {
		return [
			{
				name: 'contextPanel',
				plugin: ({ dispatch }) =>
					// @ts-ignore - Workaround for help-center local consumption

					contextPanelPluginFactory(contextPanels.filter(Boolean), dispatch),
			},
		];
	},
});
