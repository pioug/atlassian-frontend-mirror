import { Fragment, Node as PMNode, Slice } from 'prosemirror-model';
import { TextSelection, NodeSelection, Transaction } from 'prosemirror-state';
import { Transform } from 'prosemirror-transform';

import { isEmptyParagraph } from '../../../utils';

export function insertSliceIntoEmptyNode({
  tr,
  slice,
}: {
  tr: Transaction;
  slice: Slice;
}) {
  tr.replaceSelection(slice);
}

export function insertSliceAtNodeEdge({
  tr,
  slice,
}: {
  tr: Transaction;
  slice: Slice;
}) {
  const { selection } = tr;
  const { $cursor } = selection as TextSelection;

  if (!$cursor) {
    return;
  }

  const position = !$cursor.nodeBefore ? $cursor.before() : $cursor.after();
  tr.replaceRange(position, position, slice);

  const startSlicePosition = tr.doc.resolve(
    Math.min(
      position + slice.content.size - slice.openEnd,
      tr.doc.content.size,
    ),
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
  const newSelection = TextSelection.near(
    tr.doc.resolve(tr.mapping.map(mapped)),
    -1,
  );
  newSlice.openEnd = newSlice.openStart;
  tr.replaceRange(newSelection.from, newSelection.from, newSlice);

  tr.setSelection(TextSelection.near(tr.doc.resolve(newSelection.from), -1));
}

export function insertSliceInsideOfPanelNodeSelected(panelNode: PMNode) {
  return ({ tr, slice }: { tr: Transaction; slice: Slice }) => {
    const {
      selection,
      selection: { $to, $from },
    } = tr;
    const { from: panelPosition } = selection;

    // if content of slice isn't valid for a panel node, insert the invalid node and following content after
    if (
      panelNode &&
      !panelNode.type.validContent(Fragment.from(slice.content))
    ) {
      const insertPosition = $to.pos + 1;
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
          tr.doc.resolve(
            insertPosition +
              slice.content.size -
              slice.openStart -
              slice.openEnd +
              1,
          ),
        ),
      );
      return;
    }

    const temporaryDoc = new Transform(tr.doc.type.createAndFill()!);
    temporaryDoc.replaceRange(0, temporaryDoc.doc.content.size, slice);
    const sliceWithoutInvalidListSurrounding = temporaryDoc.doc.slice(0);
    const newPanel = panelNode.copy(sliceWithoutInvalidListSurrounding.content);
    const panelNodeSelected =
      selection instanceof NodeSelection ? selection.node : null;

    const replaceFrom = panelNodeSelected
      ? panelPosition
      : tr.doc.resolve(panelPosition).start();
    const replaceTo = panelNodeSelected
      ? panelPosition + panelNodeSelected.nodeSize
      : replaceFrom;

    tr.replaceRangeWith(replaceFrom, replaceTo, newPanel);

    tr.setSelection(
      TextSelection.near(tr.doc.resolve($from.pos + newPanel.content.size), -1),
    );
  };
}
