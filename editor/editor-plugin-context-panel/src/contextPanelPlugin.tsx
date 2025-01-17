import type React from 'react';

import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ContextPanelHandler } from '@atlaskit/editor-common/types';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { ContextPanelPlugin } from './contextPanelPluginType';
import { applyChange } from './pm-plugins/transforms';

export const pluginKey = new PluginKey<ContextPanelPluginState>('contextPanelPluginKey');

type ContextPanelPluginState = {
	handlers: ContextPanelHandler[];
	contents: React.ReactNode[];
};

function contextPanelPluginFactory(
	contextPanels: Array<ContextPanelHandler>,
	dispatch: Dispatch<ContextPanelPluginState>,
) {
	return new SafePlugin<ContextPanelPluginState>({
		key: pluginKey,
		state: {
			init(_config, state) {
				return {
					handlers: contextPanels,
					contents: contextPanels.map((panelContent) => panelContent(state)),
				};
			},

			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/max-params
			apply(tr, pluginState, _oldState, newState) {
				let newPluginState = pluginState;
				const meta = tr.getMeta(pluginKey);

				if (tr.docChanged || tr.selectionSet || (meta && meta.changed)) {
					const newContents = pluginState.handlers.map((panelContent) => panelContent(newState));

					const contentsLengthChanged = newContents.length !== newPluginState.contents.length;
					const contentChanged = newContents.some(
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
export const contextPanelPlugin: ContextPanelPlugin = () => ({
	name: 'contextPanel',

	actions: {
		applyChange: applyChange,
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
					contextPanelPluginFactory(contextPanels.filter(Boolean), dispatch),
			},
		];
	},
});
