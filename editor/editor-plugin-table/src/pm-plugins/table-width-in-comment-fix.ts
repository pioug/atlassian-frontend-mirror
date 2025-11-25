/*
	Existing legacy tables in Comment editor have set attributes:
	- width = 760
	- layout = 'default'.

	When "Support Table in Comment" FF is enabled, table resizing (and table alignment in Confluence comments) is turned.
	It results in (ED-24795) all exising tables being set 760px width. Instead they all should inherit width from
	the editor container until a user decided to edit their old comment and set a custom table width themselves.

	This plugin exists to fix the described issue. It ensures that once "Support Table in Comment" FF turned on,
	existing tables continue to inherit the width of editor container and are 'left-aligned' by default.
*/

import rafSchedule from 'raf-schd';

import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { akEditorDefaultLayoutWidth } from '@atlaskit/editor-shared-styles';

import { ALIGN_START } from './utils/alignment';

type TableWidthInCommentFixPluginState = {
	documentHasLoadedOnce: boolean;
};

export const pluginKey = new PluginKey<TableWidthInCommentFixPluginState>(
	'tableWidthInCommentFixPlugin',
);
const getPluginState = (state: EditorState): TableWidthInCommentFixPluginState | undefined | null =>
	state && pluginKey.getState(state);

const createPlugin = (dispatch: Dispatch, isTableAlignmentEnabled: boolean) => {
	return new SafePlugin({
		key: pluginKey,
		state: {
			// @ts-ignore - Workaround for help-center local consumption

			init() {
				return {
					documentHasLoadedOnce: false,
				};
			},
			// @ts-ignore - Workaround for help-center local consumption

			apply(tr, pluginState) {
				const meta = tr.getMeta(pluginKey);
				if (meta) {
					const keys = Object.keys(meta) as Array<keyof TableWidthInCommentFixPluginState>;
					// @ts-ignore - Workaround for help-center local consumption

					const changed = keys.some((key) => {
						return pluginState[key] !== meta[key];
					});

					if (changed) {
						const newState = { ...pluginState, ...meta };

						dispatch(pluginKey, newState);
						return newState;
					}
				}

				return pluginState;
			},
		},
		view: () => {
			return {
				// @ts-ignore - Workaround for help-center local consumption

				update(editorView) {
					const { state } = editorView;
					const pluginState = getPluginState(state);
					if (!pluginState) {
						return;
					}
					const { documentHasLoadedOnce } = pluginState;

					if (documentHasLoadedOnce) {
						return;
					}

					const { table } = state.schema.nodes;
					rafSchedule(() => {
						const tr = editorView.state.tr;
						let tableWidthAndLayoutUpdated = false;
						// @ts-ignore - Workaround for help-center local consumption

						editorView.state.doc.descendants((node, pos) => {
							const isTable = node.type === table;
							const width = node.attrs.width;
							const layout = node.attrs.layout;
							if (isTable && width === akEditorDefaultLayoutWidth && layout === 'default') {
								tableWidthAndLayoutUpdated = true;
								tr.setNodeMarkup(pos, undefined, {
									...node.attrs,
									width: null,
									layout: isTableAlignmentEnabled ? ALIGN_START : 'default',
								});
								return false;
							}
							// Returning false here because don't need to change nested tables
							return false;
						});
						if (tableWidthAndLayoutUpdated) {
							tr.setMeta('addToHistory', false);
							editorView.dispatch(tr);
						}
					})();

					editorView.dispatch(
						state.tr.setMeta(pluginKey, {
							documentHasLoadedOnce: true,
						}),
					);
				},
			};
		},
	});
};

export { createPlugin };
