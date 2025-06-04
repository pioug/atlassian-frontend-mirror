import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Command } from '@atlaskit/editor-common/types';
import { isEmptyNode } from '@atlaskit/editor-common/utils';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type {
	NodeType,
	Node as PMNode,
	ResolvedPos,
	Schema,
} from '@atlaskit/editor-prosemirror/model';
import type { Selection, Transaction } from '@atlaskit/editor-prosemirror/state';
import {
	findParentNodeOfType,
	hasParentNodeOfType,
	setTextSelection,
} from '@atlaskit/editor-prosemirror/utils';

function findParentNode(selection: Selection, nodeType: NodeType): PMNode | null {
	const parentPosition = findParentNodeOfType(nodeType)(selection);

	if (parentPosition) {
		return parentPosition.node;
	}

	return null;
}

function isInsideAnEmptyNode(selection: Selection, nodeType: NodeType, schema: Schema) {
	const parentNode = findParentNode(selection, nodeType);
	return parentNode && isEmptyNode(schema)(parentNode);
}

// Somewhat broken and subverted: https://product-fabric.atlassian.net/browse/ED-6504
export function keymapPlugin(): SafePlugin | undefined {
	const deleteCurrentItem = ($from: ResolvedPos, tr: Transaction) => {
		return tr.delete($from.before($from.depth) - 1, $from.end($from.depth) + 1);
	};

	const keymaps: Record<string, Command> = {
		Backspace: (state, dispatch) => {
			const {
				selection,
				schema: { nodes },
				tr,
			} = state;
			const { panel, blockquote, orderedList, bulletList, mediaSingle, mediaGroup, extension } =
				nodes;
			const { $from, $to } = selection;
			// Don't do anything if selection is a range
			if ($from.pos !== $to.pos) {
				return false;
			}

			// If not at the start of a panel, no joining will happen so allow default behaviour (backspacing characters etc..)
			if ($from.parentOffset !== 0) {
				return false;
			}
			const $previousPos = tr.doc.resolve(Math.max(0, $from.before($from.depth) - 1));
			const previousNodeType =
				$previousPos.pos > 0 && $previousPos.parent && $previousPos.parent.type;
			const parentNodeType = $from.parent.type;
			const isPreviousNodeAPanel = previousNodeType === panel;
			const isParentNodeAPanel = parentNodeType === panel;
			const nodeBeforePanel = $previousPos?.nodeBefore;

			const isPreviousNodeMedia =
				previousNodeType === mediaSingle || previousNodeType === mediaGroup;
			const isPreviousNodeAList =
				previousNodeType === bulletList || previousNodeType === orderedList;

			// identifies if new position after backspace is at the start of a non-bodied extension node
			const isPreviousPosAtExtension = $previousPos.nodeAfter?.type === extension;

			// Stops merging panels when deleting empty paragraph in between
			// Stops merging blockquotes with panels when deleting from start of blockquote
			if (
				(isPreviousNodeAPanel && !isParentNodeAPanel && !isPreviousPosAtExtension) ||
				isInsideAnEmptyNode(selection, panel, state.schema) ||
				(hasParentNodeOfType(blockquote)(selection) &&
					!isPreviousNodeAList &&
					!isPreviousNodeMedia &&
					!isPreviousPosAtExtension) ||
				// Lift line of panel content up and out of the panel, when backspacing
				// at the start of a panel, if the node before the panel is an 'isolating' node
				// (for e.g. a table, or an expand), otherwise the default prosemirror backspace
				// behaviour will fallback to 'select node backward' logic because the node
				// before is an isolating node.
				(nodeBeforePanel?.type?.spec?.isolating && hasParentNodeOfType(panel)(selection))
			) {
				const content = $from.node($from.depth).content;
				const insertPos = $previousPos.pos;
				deleteCurrentItem($from, tr).insert(insertPos, content);
				if (dispatch) {
					dispatch(setTextSelection(insertPos)(tr).scrollIntoView());
				}
				return true;
			}
			const nodeType = $from.node().type;
			if (nodeType !== panel) {
				return false;
			}
			return true;
		},
	};
	return keymap(keymaps) as SafePlugin;
}

export default keymapPlugin;
