import { GapCursorSelection, Side } from '../plugins/gap-cursor/selection';
import { CellSelection } from 'prosemirror-tables';
import { EditorView } from 'prosemirror-view';
import { NodeSelection, TextSelection, AllSelection } from 'prosemirror-state';

export const setNodeSelection = (view: EditorView, pos: number) => {
  const { state, dispatch } = view;

  if (!isFinite(pos)) {
    return;
  }

  const tr = state.tr.setSelection(NodeSelection.create(state.doc, pos));
  dispatch(tr);
};

export function setTextSelection(
  view: EditorView,
  anchor: number,
  head?: number,
) {
  const { state, dispatch } = view;
  const tr = state.tr.setSelection(
    TextSelection.create(state.doc, anchor, head),
  );
  dispatch(tr);
}

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
