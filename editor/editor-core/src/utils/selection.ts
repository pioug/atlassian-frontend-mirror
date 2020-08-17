import { CellSelection } from 'prosemirror-tables';
import { EditorView } from 'prosemirror-view';
import {
  EditorState,
  NodeSelection,
  TextSelection,
  AllSelection,
} from 'prosemirror-state';

import { Mark, Node } from 'prosemirror-model';

import { browser } from '@atlaskit/editor-common';

import { GapCursorSelection, Side } from '../plugins/gap-cursor/selection';

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

export const normaliseNestedLayout = (state: EditorState, node: Node) => {
  if (state.selection.$from.depth > 1) {
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
    const breakoutMark: Mark = state.schema.marks.breakout;
    if (breakoutMark && breakoutMark.isInSet(node.marks)) {
      const newMarks = breakoutMark.removeFromSet(node.marks);
      return node.type.createChecked(node.attrs, node.content, newMarks);
    }
  }

  return node;
};

// @see: https://github.com/ProseMirror/prosemirror/issues/710
// @see: https://bugs.chromium.org/p/chromium/issues/detail?id=740085
// Chrome >= 58 (desktop only)
export const isChromeWithSelectionBug =
  browser.chrome && !browser.android && browser.chrome_version >= 58;
