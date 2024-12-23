import { isEmptyParagraph } from '@atlaskit/editor-common/utils';
import type { Node as PMNode, Schema, Slice } from '@atlaskit/editor-prosemirror/model';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { Transform } from '@atlaskit/editor-prosemirror/transform';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';

export function insertSliceIntoEmptyNode({ tr, slice }: { tr: Transaction; slice: Slice }) {
	tr.replaceSelection(slice);
}

export function insertSliceAtNodeEdge({ tr, slice }: { tr: Transaction; slice: Slice }) {
	const { selection } = tr;
	const { $cursor } = selection as TextSelection;

	if (!$cursor) {
		return;
	}

	const position = !$cursor.nodeBefore ? $cursor.before() : $cursor.after();
	tr.replaceRange(position, position, slice);

	const startSlicePosition = tr.doc.resolve(
		Math.min(position + slice.content.size - slice.openEnd, tr.doc.content.size),
	);

	const direction = -1;

	tr.setSelection(TextSelection.near(startSlicePosition, direction));
}

export function insertSliceIntoRangeSelectionInsideList({
	tr,
	slice,
}: {
	tr: Transaction;
	slice: Slice;
}) {
	const {
		selection: { $to, $from, to, from },
	} = tr;

	// when the selection is inside of the same list item
	// we can use a normal replace
	if ($from.sameParent($to) || $from.depth === $to.depth) {
		return tr.replaceSelection(slice);
	}

	// if pasting a list inside another list, ensure no empty list items get added
	const newRange = $from.blockRange($to);
	if (!newRange) {
		return;
	}

	const startPos = from;
	const endPos = $to.nodeAfter ? to : to + 2;
	const newSlice = tr.doc.slice(endPos, newRange.end);
	tr.deleteRange(startPos, newRange.end);
	const mapped = tr.mapping.map(startPos);
	tr.replaceRange(mapped, mapped, slice);
	if (newSlice.size <= 0) {
		return;
	}
	const newSelection = TextSelection.near(tr.doc.resolve(tr.mapping.map(mapped)), -1);
	// @ts-ignore - [unblock prosemirror bump] assigning to readonly prop
	newSlice.openEnd = newSlice.openStart;
	tr.replaceRange(newSelection.from, newSelection.from, newSlice);

	tr.setSelection(TextSelection.near(tr.doc.resolve(newSelection.from), -1));
}

export function insertSliceInsideOfPanelNodeSelected(panelNode: PMNode) {
	return ({ tr, slice, schema }: { tr: Transaction; slice: Slice; schema?: Schema }) => {
		const {
			selection,
			selection: { $to, $from },
		} = tr;
		const { from: panelPosition } = selection;

		// if content of slice isn't valid for a panel node, insert the invalid node and following content after
		if (panelNode && !panelNode.type.validContent(Fragment.from(slice.content))) {
			let insertPosition = $to.pos + 1;

			/* Adapting above logic to handle MBE, as it currently assumes that slice can be safely inserted after the panel node, which is not the case for MBE
         If insertPosition is in MBE and current slice contains invalid content for MBE, we need to insert the slice after the MBE node
      */
			if (schema) {
				const mbeParentOfPanel = findParentNodeOfType(schema.nodes.multiBodiedExtension)(selection);
				if (
					mbeParentOfPanel &&
					!mbeParentOfPanel.node.type.validContent(Fragment.from(slice.content))
				) {
					insertPosition = mbeParentOfPanel.start + mbeParentOfPanel.node.nodeSize - 1;
				}
			}

			tr.replaceRange(insertPosition, insertPosition, slice);
			// need to delete the empty paragraph at the top of the panel
			const parentNode = tr.doc.resolve($from.before()).node();
			if (
				parentNode &&
				parentNode.childCount > 1 &&
				parentNode.firstChild?.type.name === 'paragraph' &&
				isEmptyParagraph(parentNode.firstChild)
			) {
				const startPosDelete = tr.doc.resolve($from.before()).posAtIndex(0);
				const endPosDelete = tr.doc.resolve($from.before()).posAtIndex(1);
				const SIZE_OF_EMPTY_PARAGRAPH = 2; // {startPos}<p>{startPos + 1}</p>{endPos}
				if (endPosDelete - startPosDelete === SIZE_OF_EMPTY_PARAGRAPH) {
					tr.delete(startPosDelete, endPosDelete);
				}
			}
			tr.setSelection(
				TextSelection.near(
					tr.doc.resolve(insertPosition + slice.content.size - slice.openStart - slice.openEnd + 1),
				),
			);
			return;
		}

		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const temporaryDoc = new Transform(tr.doc.type.createAndFill()!);
		temporaryDoc.replaceRange(0, temporaryDoc.doc.content.size, slice);
		const sliceWithoutInvalidListSurrounding = temporaryDoc.doc.slice(0);
		const newPanel = panelNode.copy(sliceWithoutInvalidListSurrounding.content);
		const panelNodeSelected = selection instanceof NodeSelection ? selection.node : null;

		const replaceFrom = panelNodeSelected ? panelPosition : tr.doc.resolve(panelPosition).start();
		const replaceTo = panelNodeSelected ? panelPosition + panelNodeSelected.nodeSize : replaceFrom;

		tr.replaceRangeWith(replaceFrom, replaceTo, newPanel);

		tr.setSelection(TextSelection.near(tr.doc.resolve($from.pos + newPanel.content.size), -1));
	};
}
