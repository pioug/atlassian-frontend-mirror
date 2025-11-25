import rafSchedule from 'raf-schd';

import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { pluginFactory } from '@atlaskit/editor-common/utils';
import { PluginKey, type EditorState, type Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import type { EditorDisabledPlugin, EditorDisabledPluginState } from './editorDisabledPluginType';
import { ACTION, reducer } from './pm-plugins/reducer';

export const pluginKey = new PluginKey<EditorDisabledPluginState>('editorDisabledPlugin');

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
			const disabledMeta: EditorDisabledPluginState = {
				editorDisabled: !view.editable,
				disabledByPlugin: getPluginState(view.state).disabledByPlugin,
			};

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
			init: (): EditorDisabledPluginState => {
				return {
					editorDisabled: options?.initialDisabledState ?? false,
					disabledByPlugin: false,
				};
			},
			// @ts-ignore - Workaround for help-center local consumption

			apply: (tr, pluginState) => {
				const meta = tr.getMeta(pluginKey);
				if (meta) {
					if (fg('platform_editor_ai_aifc_patch_beta')) {
						if ('action' in meta) {
							return reducer(pluginState, meta);
						}
					}
					return pluginState.editorDisabled !== meta.editorDisabled
						? { ...pluginState, ...meta }
						: pluginState;
				}
				return pluginState;
			},
		},
		props: {
			// If we set to undefined it respects the previous value.
			// Prosemirror doesn't have this typed correctly for this type of behaviour
			// @ts-ignore - Workaround for help-center local consumption
			editable: fg('platform_editor_ai_aifc_patch_beta')
				? (state: EditorState) => {
						const { disabledByPlugin } = pluginKey.getState(state) ?? { disabledByPlugin: false };
						return disabledByPlugin ? false : undefined;
					}
				: undefined,
		},
		// @ts-ignore - Workaround for help-center local consumption

		view: (view) => {
			// schedule on mount
			scheduleEditorDisabledUpdate(view);
			return {
				// @ts-ignore - Workaround for help-center local consumption

				update(view) {
					scheduleEditorDisabledUpdate(view);
				},
				// @ts-ignore - Workaround for help-center local consumption

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

		if (fg('platform_editor_ai_aifc_patch_beta')) {
			return {
				editorDisabled: pluginState.disabledByPlugin || pluginState.editorDisabled,
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

	commands: {
		toggleDisabled:
			(disabled: boolean) =>
			({ tr }: { tr: Transaction }) => {
				return fg('platform_editor_ai_aifc_patch_beta')
					? tr.setMeta(pluginKey, {
							action: ACTION.TOGGLE_DISABLED,
							disabled,
						})
					: null;
			},
	},
});
