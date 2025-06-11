import rafSchedule from 'raf-schd';

import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { pluginFactory } from '@atlaskit/editor-common/utils';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { EditorDisabledPlugin, EditorDisabledPluginState } from './editorDisabledPluginType';

const pluginKey = new PluginKey<EditorDisabledPluginState>('editorDisabledPlugin');

function reducer(_pluginState: EditorDisabledPluginState, meta: EditorDisabledPluginState) {
	return meta;
}

const { getPluginState } = pluginFactory(pluginKey, reducer);

/*
Stores the state of the editor enabled/disabled for panel and floating
toolbar to subscribe to through useSharedPluginState. Otherwise the NodeViews
won't re-render when it changes.
*/
function createPlugin(
	dispatch: Dispatch<EditorDisabledPluginState>,
	options?: { initialDisabledState?: boolean },
): SafePlugin | undefined {
	const scheduleEditorDisabledUpdate = rafSchedule((view: EditorView) => {
		if (getPluginState(view.state).editorDisabled !== !view.editable) {
			const disabledMeta = {
				editorDisabled: !view.editable,
			} as EditorDisabledPluginState;

			const tr = view.state.tr
				.setMeta(pluginKey, disabledMeta)
				.setMeta('editorDisabledPlugin', disabledMeta);
			tr.setMeta('isLocal', true);
			view.dispatch(tr);
		}
	});

	return new SafePlugin({
		key: pluginKey,
		state: {
			init: () => {
				return {
					editorDisabled: options?.initialDisabledState ?? false,
				} as EditorDisabledPluginState;
			},
			apply: (tr, pluginState) => {
				const meta = tr.getMeta(pluginKey);
				if (meta) {
					return pluginState.editorDisabled !== meta.editorDisabled
						? { ...pluginState, ...meta }
						: pluginState;
				}
				return pluginState;
			},
		},
		view: (view) => {
			// schedule on mount
			scheduleEditorDisabledUpdate(view);
			return {
				update(view) {
					scheduleEditorDisabledUpdate(view);
				},
				destroy() {
					scheduleEditorDisabledUpdate.cancel();
				},
			};
		},
	});
}

/**
 * Editor disabled plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 *
 * @param options - Plugin configuration options
 * @returns EditorDisabledPlugin
 *
 * @example
 * ```typescript
 * // Basic usage
 * .add(editorDisabledPlugin)
 *
 * // With initial disabled state
 * .add(editorDisabledPlugin, { initialDisabledState: true })
 * ```
 */
export const editorDisabledPlugin: EditorDisabledPlugin = ({ config: options = {}, api }) => ({
	name: 'editorDisabled',

	getSharedState(editorState) {
		if (!editorState) {
			return {
				editorDisabled: false,
			};
		}

		const pluginState = pluginKey.getState(editorState);

		if (!pluginState) {
			return {
				editorDisabled: false,
			};
		}

		return pluginState;
	},

	pmPlugins: () => [
		{
			name: 'editorDisabled',
			plugin: ({ dispatch }) => createPlugin(dispatch, options),
		},
	],
});
