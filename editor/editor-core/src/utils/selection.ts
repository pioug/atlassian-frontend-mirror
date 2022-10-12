import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { EditorView } from 'prosemirror-view';
import {
  Transaction,
  EditorState,
  NodeSelection,
  TextSelection,
  AllSelection,
  Selection,
} from 'prosemirror-state';
import { Mark, Node } from 'prosemirror-model';
import { GapCursorSelection, Side } from '@atlaskit/editor-common/selection';

export {
  setNodeSelection,
  setTextSelection,
} from '@atlaskit/editor-common/utils';

export function setAllSelection(view: EditorView) {
  const { state, dispatch } = view;
  const tr = state.tr.setSelection(new AllSelection(view.state.doc));
  dispatch(tr);
}

export function setGapCursorSelection(
  view: EditorView,
  pos: number,
  side: Side,
) {
  const { state } = view;
  view.dispatch(
    state.tr.setSelection(new GapCursorSelection(state.doc.resolve(pos), side)),
  );
}

export function setCellSelection(
  view: EditorView,
  anchor: number,
  head?: number,
) {
  const { state, dispatch } = view;
  dispatch(
    state.tr.setSelection(CellSelection.create(state.doc, anchor, head) as any),
  );
}

export const normaliseNestedLayout = (
  { selection, doc }: EditorState | Transaction,
  node: Node,
) => {
  if (selection.$from.depth > 1) {
    if (node.attrs.layout && node.attrs.layout !== 'default') {
      return node.type.createChecked(
        {
          ...node.attrs,
          layout: 'default',
        },
        node.content,
        node.marks,
      );
    }

    // If its a breakout layout, we can remove the mark
    // Since default isn't a valid breakout mode.
    const breakoutMark: Mark = doc.type.schema.marks.breakout;
    if (breakoutMark && breakoutMark.isInSet(node.marks)) {
      const newMarks = breakoutMark.removeFromSet(node.marks);
      return node.type.createChecked(node.attrs, node.content, newMarks);
    }
  }

  return node;
};

// checks if the given position is within the ProseMirror document
export const isValidPosition = (pos: number, state: EditorState): boolean => {
  if (pos >= 0 && pos <= state.doc.resolve(0).end()) {
    return true;
  }

  return false;
};

export const duplicateSelection = (
  selectionToDuplicate: Selection,
  doc: Node,
): Selection | undefined => {
  if (selectionToDuplicate instanceof NodeSelection) {
    return NodeSelection.create(doc, selectionToDuplicate.from);
  } else if (selectionToDuplicate instanceof TextSelection) {
    return TextSelection.create(
      doc,
      selectionToDuplicate.from,
      selectionToDuplicate.to,
    );
  } else if (selectionToDuplicate instanceof GapCursorSelection) {
    return new GapCursorSelection(
      doc.resolve(selectionToDuplicate.from),
      selectionToDuplicate.side,
    );
  } else if (selectionToDuplicate instanceof CellSelection) {
    return new CellSelection(
      doc.resolve(selectionToDuplicate.$anchorCell.pos),
      doc.resolve(selectionToDuplicate.$headCell.pos),
    );
  }
};
