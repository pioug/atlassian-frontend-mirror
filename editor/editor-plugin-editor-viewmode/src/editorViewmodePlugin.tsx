import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type {
	EditorViewModePlugin,
	EditorViewModePluginState,
	ViewMode,
} from './editorViewmodePluginType';

const viewModePluginKey = new PluginKey<EditorViewModePluginState>('editorViewMode');

const createPlugin = ({ initialMode }: { initialMode: ViewMode | undefined }) => {
	return new SafePlugin({
		key: viewModePluginKey,
		state: {
			init: () => ({ mode: initialMode ?? 'edit' }),
			apply: (tr, pluginState) => {
				const meta = tr.getMeta(viewModePluginKey);
				if (meta) {
					return meta;
				}

				return pluginState;
			},
		},
		props: {
			// If we set to undefined it respects the previous value.
			// Prosemirror doesn't have this typed correctly for this type of behaviour
			// We will fast-follow to consolidate the logic with `editor-disabled` so we don't
			// need this workaround.
			// @ts-expect-error
			editable: (state: EditorState) => {
				const mode = viewModePluginKey.getState(state)?.mode;
				return mode === 'view' ? false : undefined;
			},
		},
	});
};

/**
 * View Mode plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
export const editorViewModePlugin: EditorViewModePlugin = ({ config: options, api }) => {
	return {
		name: 'editorViewMode',

		getSharedState(editorState): EditorViewModePluginState {
			if (!editorState) {
				return {
					mode: options?.mode === 'view' ? 'view' : 'edit',
				} as EditorViewModePluginState; // Skipping type safety for the deprecated mode property
			}

			return {
				mode: viewModePluginKey.getState(editorState)?.mode ?? 'edit',
			} as EditorViewModePluginState; // Skipping type safety for the deprecated mode property
		},

		commands: {
			updateViewMode:
				(mode: ViewMode) =>
				({ tr }) => {
					return tr.setMeta(viewModePluginKey, { mode });
				},
		},

		pmPlugins() {
			return [
				{
					name: 'editorViewMode',
					plugin: () => createPlugin({ initialMode: options?.mode }),
				},
			];
		},
	};
};
