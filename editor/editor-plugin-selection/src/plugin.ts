import type { SelectionSharedState } from '@atlaskit/editor-common/selection';
import type { EditorCommand, NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

import { selectNearNode } from './commands';
import gapCursorKeymapPlugin from './pm-plugins/gap-cursor-keymap';
import gapCursorPlugin from './pm-plugins/gap-cursor-main';
import { gapCursorPluginKey } from './pm-plugins/gap-cursor-plugin-key';
import selectionKeymapPlugin from './pm-plugins/keymap';
import { createPlugin } from './pm-plugins/selection-main';
import type { EditorSelectionAPI, SelectionPluginOptions } from './types';
import { selectionPluginKey } from './types';

export type SelectionPlugin = NextEditorPlugin<
	'selection',
	{
		pluginConfiguration: SelectionPluginOptions | undefined;
		actions: EditorSelectionAPI;
		commands: {
			displayGapCursor: (toggle: boolean) => EditorCommand;
		};
		sharedState: SelectionSharedState;
	}
>;

const displayGapCursor =
	(toggle: boolean): EditorCommand =>
	({ tr }) => {
		return tr.setMeta(gapCursorPluginKey, {
			displayGapCursor: toggle,
		});
	};

export const selectionPlugin: SelectionPlugin = ({ config: options }) => ({
	name: 'selection',

	commands: {
		displayGapCursor,
	},

	actions: {
		selectNearNode:
			({ selectionRelativeToNode, selection }) =>
			(state: EditorState): Transaction => {
				return selectNearNode(selectionRelativeToNode, selection)({ tr: state.tr }) || state.tr;
			},
	},

	getSharedState(editorState) {
		if (!editorState) {
			return undefined;
		}
		const pluginState = selectionPluginKey.getState(editorState);
		return {
			selectionRelativeToNode: pluginState?.selectionRelativeToNode,
			selection: pluginState?.selection,
		};
	},

	pmPlugins() {
		return [
			{
				name: 'selection',
				plugin: ({ dispatch, dispatchAnalyticsEvent }) =>
					createPlugin(dispatch, dispatchAnalyticsEvent, options),
			},
			{
				name: 'selectionKeymap',
				plugin: selectionKeymapPlugin,
			},
			{
				name: 'gapCursorKeymap',
				plugin: () => gapCursorKeymapPlugin(),
			},
			{
				name: 'gapCursor',
				plugin: () => gapCursorPlugin,
			},
		];
	},
});

export default selectionPlugin;
