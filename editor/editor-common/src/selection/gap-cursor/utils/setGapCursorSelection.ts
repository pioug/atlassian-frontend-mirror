import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { Side } from '../selection';
import { GapCursorSelection } from '../selection';

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
