/* Copied from type-ahead */
import { normaliseNestedLayout, safeInsert } from '@atlaskit/editor-common/insert';
import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { Fragment, Node as PMNode, Slice } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';

function findInsertPoint(
	doc: PMNode,
	pos: number,
	nodeToInsert: PMNode,
): { from: number; to: number } {
	const $pos = doc.resolve(pos);
	const createInsertPosition = (from: number, to?: number) => ({
		from,
		to: to || from,
	});

	// Search for a valid position for nodeToInsert in progressively higher levels
	for (let level = $pos.depth; level >= 0; level--) {
		const nodeAtLevel = $pos.node(level);

		// Try to replace the empty paragraph in the level above
		// Scenario:
		//   doc(
		//     table(
		//       row(
		//         cell(
		//           p('{<>}'),
		//         ),
		//       )
		//     )
		//   )
		const levelAbove = Math.max(level - 1, 0);
		const parentNode = $pos.node(levelAbove);
		// Special case: when this is true, the 'to' position should be the end
		// of the empty paragraph
		const isNodeAtLevelEmptyParagraph =
			nodeAtLevel.type.name === 'paragraph' && nodeAtLevel.content.size === 0;
		const indexAtLevelAbove = $pos.index(levelAbove);
		const canReplaceNodeAtLevelAbove = parentNode.canReplaceWith(
			indexAtLevelAbove,
			indexAtLevelAbove,
			nodeToInsert.type,
		);
		if (isNodeAtLevelEmptyParagraph && canReplaceNodeAtLevelAbove) {
			const from = $pos.posAtIndex(indexAtLevelAbove, levelAbove);
			return createInsertPosition(from, from + nodeAtLevel.nodeSize);
		}

		// Try to insert this node right after the node in the level above
		// Scenario:
		//   doc(
		//     panel(
		//       p('{<>}'),
		//     )
		//   )
		const indexAfterAtLevelAbove = $pos.indexAfter(levelAbove);
		const canInsertNodeAtLevelAbove = parentNode.canReplaceWith(
			indexAfterAtLevelAbove,
			indexAfterAtLevelAbove,
			nodeToInsert.type,
		);

		if (canInsertNodeAtLevelAbove) {
			return createInsertPosition($pos.posAtIndex(indexAfterAtLevelAbove, levelAbove));
		}
	}

	return createInsertPosition(0);
}

type Position = {
	$from: ResolvedPos;
	$to: ResolvedPos;
};
type InsertBlockNodeProps = {
	node: PMNode;
	position: Position;
	tr: Transaction;
};
export const insertBlockNode = ({ node, tr, position }: InsertBlockNodeProps): Transaction => {
	const {
		$from: { pos: start },
		$to: { pos: end },
	} = position;

	if (node.isText) {
		return tr.replaceWith(start, end, node);
	}

	if (node.isBlock) {
		const mappedStart = start;
		const nodeNormalized = normaliseNestedLayout(tr, node);

		// Handle edge cases for hr and mediaSingle
		const inserted = safeInsert(nodeNormalized, mappedStart)(tr);
		if (inserted) {
			return tr;
		}

		const sliceInserted = Slice.maxOpen(Fragment.from(nodeNormalized));

		const { from, to } = findInsertPoint(tr.doc, mappedStart, nodeNormalized);
		tr.replaceWith(from, to, node);

		const openPosition = Math.min(
			from + (node.isAtom ? node.nodeSize : sliceInserted.openStart),
			tr.doc.content.size,
		);
		const FORWARD_DIRECTION = 1;
		const nextSelection = TextSelection.findFrom(
			tr.doc.resolve(openPosition),
			FORWARD_DIRECTION,
			true,
		);
		if (nextSelection) {
			return tr.setSelection(nextSelection);
		}
	}

	return tr;
};

type InsertInlineNodeOrFragmentProps = {
	maybeFragment: Fragment | PMNode;
	position: Position;
	selectInlineNode: boolean;
	tr: Transaction;
};
export const insertInlineNodeOrFragment = ({
	maybeFragment,
	tr,
	position,
	selectInlineNode,
}: InsertInlineNodeOrFragmentProps): Transaction => {
	const {
		$from: { pos: start },
		$to: { pos: end },
	} = position;

	const fragment = maybeFragment instanceof PMNode ? Fragment.from(maybeFragment) : maybeFragment;

	tr.replaceWith(start, end, fragment);

	if (selectInlineNode) {
		return tr.setSelection(NodeSelection.create(tr.doc, start));
	}

	return tr.setSelection(TextSelection.near(tr.doc.resolve(start + (fragment?.size || 0))));
};

type InsertProseMirrorContentProps = {
	node: PMNode | Fragment;
	position: {
		$from: ResolvedPos;
		$to: ResolvedPos;
	};
	selectNodeInserted: boolean;
	tr: Transaction;
};
export const insertProseMirrorContent = ({
	tr,
	node,
	position,
	selectNodeInserted,
}: InsertProseMirrorContentProps) => {
	if (node instanceof PMNode && node.isBlock) {
		insertBlockNode({
			node,
			tr,
			position,
		});
	} else {
		insertInlineNodeOrFragment({
			maybeFragment: node,
			tr,
			position,
			selectInlineNode: selectNodeInserted,
		});
	}
};
