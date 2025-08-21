import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	backspace,
	bindKeymapWithCommand,
	findShortcutByKeymap,
	indent,
	outdent,
} from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { isTextSelection } from '@atlaskit/editor-common/utils';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import { hasParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';

import { getIndentCommand, getOutdentCommand } from '../editor-commands';

export function keymapPlugin(
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): SafePlugin | undefined {
	const list = {};

	bindKeymapWithCommand(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		findShortcutByKeymap(indent)!,
		(state, dispatch) => {
			const { blockTaskItem, paragraph, doc } = state.schema.nodes;

			if (blockTaskItem) {
				let hasBlockTaskItem = false;
				let hasParagraphAtDocLevel = false;
				// Check if the selection contains a blockTaskItem
				state.doc.nodesBetween(state.selection.from, state.selection.to, (node, _pos, parent) => {
					if (node.type === blockTaskItem) {
						hasBlockTaskItem = true;
						return false; // stop iterating
					}
					if (node.type === paragraph && parent?.type === doc) {
						hasParagraphAtDocLevel = true;
					}
				});
				if (hasBlockTaskItem && !hasParagraphAtDocLevel) {
					return false; // let `editor-plugin-tasks-and-decisions` handle indentation
				}
			}
			return getIndentCommand(editorAnalyticsAPI)(INPUT_METHOD.KEYBOARD)(state, dispatch);
		},
		list,
	);

	bindKeymapWithCommand(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		findShortcutByKeymap(outdent)!,
		getOutdentCommand(editorAnalyticsAPI)(INPUT_METHOD.KEYBOARD),
		list,
	);

	bindKeymapWithCommand(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		findShortcutByKeymap(backspace)!,
		(state, dispatch) => {
			const { selection } = state;
			const { blockTaskItem } = state.schema.nodes;

			// Let `editor-plugin-tasks-and-decisions` handle indentation inside blockTaskItems
			if (
				isTextSelection(selection) &&
				selection.$cursor &&
				selection.$cursor.parentOffset === 0 &&
				!hasParentNodeOfType([blockTaskItem])(selection)
			) {
				return dispatch
					? getOutdentCommand(editorAnalyticsAPI)(INPUT_METHOD.KEYBOARD)(state, dispatch)
					: false;
			}
			return false;
		},
		list,
	);

	return keymap(list) as SafePlugin;
}

export default keymapPlugin;
