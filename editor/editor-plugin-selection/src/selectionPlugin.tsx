import type { EditorCommand } from '@atlaskit/editor-common/types';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

import { createAutoExpandSelectionRangeOnInlineNodePlugin } from './pm-plugins/auto-expand-selection-range-on-inline-node-main';
import { selectNearNode } from './pm-plugins/commands';
import gapCursorKeymapPlugin from './pm-plugins/gap-cursor-keymap';
import gapCursorPlugin from './pm-plugins/gap-cursor-main';
import { gapCursorPluginKey } from './pm-plugins/gap-cursor-plugin-key';
import selectionKeymapPlugin from './pm-plugins/keymap';
import { createMarkBoundaryCursorPlugin } from './pm-plugins/mark-boundary-cursor-main';
import { createPlugin } from './pm-plugins/selection-main';
import type { SelectionPlugin } from './selectionPluginType';
import { selectionPluginKey } from './types';

const displayGapCursor =
	(toggle: boolean): EditorCommand =>
	({ tr }) => {
		return tr.setMeta(gapCursorPluginKey, {
			displayGapCursor: toggle,
		});
	};

const clearManualSelection =
	(): EditorCommand =>
	({ tr }) => {
		const currMeta = tr.getMeta(selectionPluginKey);
		return tr.setMeta(selectionPluginKey, {
			...currMeta,
			manualSelection: {},
		});
	};

const setManualSelection =
	(anchor: number, head: number): EditorCommand =>
	({ tr }) => {
		const currMeta = tr.getMeta(selectionPluginKey);
		return tr.setMeta(selectionPluginKey, {
			...currMeta,
			manualSelection: { anchor, head },
		});
	};

export const selectionPlugin: SelectionPlugin = ({ api, config: options }) => ({
	name: 'selection',

	commands: {
		displayGapCursor,
		clearManualSelection,
		setManualSelection,
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
					createPlugin(api, dispatch, dispatchAnalyticsEvent, options),
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
			{
				name: 'markBoundaryCursor',
				plugin: () => createMarkBoundaryCursorPlugin(),
			},
			{
				name: 'autoExpandSelectionRangeOnInlineNode',
				plugin: () => createAutoExpandSelectionRangeOnInlineNodePlugin(),
			},
		];
	},
});

export default selectionPlugin;
