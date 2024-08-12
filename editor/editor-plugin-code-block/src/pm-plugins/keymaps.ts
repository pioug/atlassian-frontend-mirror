import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { CommandDispatch } from '@atlaskit/editor-common/types';
import { isEmptyNode } from '@atlaskit/editor-common/utils';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { Node, ResolvedPos, Schema } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { Selection } from '@atlaskit/editor-prosemirror/state';
import {
	findParentNodeOfTypeClosestToPos,
	hasParentNodeOfType,
} from '@atlaskit/editor-prosemirror/utils';

import { getCursor } from '../utils';

const deleteCurrentItem =
	($from: ResolvedPos) =>
	(tr: Transaction): Transaction => {
		return tr.delete($from.before($from.depth), $from.after($from.depth));
	};

const setTextSelection =
	(pos: number) =>
	(tr: Transaction): Transaction => {
		const newSelection = Selection.findFrom(tr.doc.resolve(pos), -1, true);
		if (newSelection) {
			tr.setSelection(newSelection);
		}
		return tr;
	};

// This method converts the code block with a Paragraph, while replacing it's
// newline `\n` characters with `hardBreak`s to ensure that they are retained in the
// rendered output. `prosemirror-transform` v1.74 introduced new behaviour for
// `setBlockType` which means we can't use it here without losing whitespace
// https://github.com/ProseMirror/prosemirror-transform/blob/master/CHANGELOG.md#174-2023-07-28
const replaceWithParagraph = (
	node: Node,
	nodePos: number,
	$cursor: ResolvedPos,
	state: EditorState,
	dispatch: CommandDispatch,
) => {
	const { paragraph, hardBreak } = state.schema.nodes;
	const nodeLines = node.textContent.split('\n');
	const { tr } = state;

	const newNodes: Node[] = [];

	nodeLines.forEach((line, index) => {
		if (index > 0) {
			newNodes.push(hardBreak.create());
		}
		if (line) {
			newNodes.push(state.schema.text(line));
		}
	});

	const newParagraph = paragraph.createChecked([], newNodes);

	tr.replaceWith(nodePos, nodePos + node.nodeSize, newParagraph);
	setTextSelection($cursor.pos)(tr);
	dispatch(tr);
};

export function keymapPlugin(schema: Schema): SafePlugin | undefined {
	return keymap({
		Backspace: (state: EditorState, dispatch?: CommandDispatch) => {
			const $cursor = getCursor(state.selection);
			const { codeBlock, listItem, table, layoutColumn } = state.schema.nodes;
			if (!$cursor || $cursor.parent.type !== codeBlock || !dispatch) {
				return false;
			}

			if (
				$cursor.pos === 1 ||
				(hasParentNodeOfType(listItem)(state.selection) && $cursor.parentOffset === 0)
			) {
				const node = findParentNodeOfTypeClosestToPos($cursor, codeBlock);

				if (!node) {
					return false;
				}

				replaceWithParagraph(node.node, node.pos, $cursor, state, dispatch);

				return true;
			}
			if (
				$cursor.node &&
				isEmptyNode(schema)($cursor.node()) &&
				(hasParentNodeOfType(layoutColumn)(state.selection) ||
					hasParentNodeOfType(table)(state.selection))
			) {
				const { tr } = state;
				const insertPos = $cursor.pos;
				deleteCurrentItem($cursor)(tr);
				setTextSelection(insertPos)(tr);
				dispatch(tr.scrollIntoView());

				return true;
			}

			// Handle not nested empty code block
			if (isEmptyNode(schema)($cursor.node())) {
				dispatch(deleteCurrentItem($cursor)(state?.tr));
				return true;
			}

			return false;
		},
	}) as SafePlugin;
}

export default keymapPlugin;
