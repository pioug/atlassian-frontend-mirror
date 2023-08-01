import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type {
  EditorState,
  Selection,
} from '@atlaskit/editor-prosemirror/state';
import {
  NodeSelection,
  TextSelection,
  AllSelection,
} from '@atlaskit/editor-prosemirror/state';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { Side } from '@atlaskit/editor-common/selection';
import { GapCursorSelection } from '@atlaskit/editor-common/selection';

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
