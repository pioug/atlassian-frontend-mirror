import { keymap } from 'prosemirror-keymap';
import {
  Plugin,
  Selection,
  TextSelection,
  NodeSelection,
} from 'prosemirror-state';
import * as keymaps from '../../../keymaps';
import { GapCursorSelection, Side } from '../../gap-cursor';
import { findExpand } from '../utils';
import { EditorView } from 'prosemirror-view';
import { findTypeAheadQuery } from '../../type-ahead/utils/find-query-mark';
import { isEmptyNode } from '../../../utils';
import { expandClassNames } from '../ui/class-names';
import { deleteExpand } from '../commands';

const focusTitle = (view: EditorView, pos: number) => {
  const dom = view.domAtPos(pos);
  const expandWrapper = dom.node.parentElement;
  if (expandWrapper) {
    const input = expandWrapper.querySelector('input');
    if (input) {
      input.focus();
      return true;
    }
  }
  return false;
};

export function expandKeymap(): Plugin {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.moveRight.common!,
    (state, _dispatch, editorView) => {
      if (!editorView) {
        return false;
      }
      const { selection } = state;
      const { nodeAfter } = selection.$from;
      const { expand, nestedExpand } = state.schema.nodes;

      if (
        selection instanceof GapCursorSelection &&
        selection.side === Side.LEFT &&
        nodeAfter &&
        (nodeAfter.type === expand || nodeAfter.type === nestedExpand)
      ) {
        const { $from } = selection;
        return focusTitle(editorView, $from.pos + 1);
      }
      return false;
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.moveLeft.common!,
    (state, _dispatch, editorView) => {
      if (!editorView) {
        return false;
      }
      const { selection } = state;
      const { nodeBefore } = selection.$from;
      const { expand, nestedExpand } = state.schema.nodes;
      if (
        selection instanceof GapCursorSelection &&
        selection.side === Side.RIGHT &&
        nodeBefore &&
        (nodeBefore.type === expand || nodeBefore.type === nestedExpand)
      ) {
        const { $from } = selection;
        return focusTitle(editorView, Math.max($from.pos - 1, 0));
      }
      return false;
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.tab.common!,
    (state, dispatch, editorView) => {
      const $nodeAfter = state.selection.$from.nodeAfter;

      if (
        state.selection instanceof GapCursorSelection &&
        state.selection.side === Side.LEFT &&
        $nodeAfter &&
        $nodeAfter.type === state.schema.nodes.expand &&
        editorView
      ) {
        const { tr } = state;
        const pos = state.selection.from;

        tr.setSelection(new NodeSelection(tr.doc.resolve(pos)));

        if (dispatch) {
          dispatch(tr);
        }
        return true;
      }

      if (
        state.selection instanceof NodeSelection &&
        state.selection.node.type === state.schema.nodes.expand &&
        editorView &&
        editorView.dom instanceof HTMLElement
      ) {
        const { from } = state.selection;
        const expand = editorView.nodeDOM(from);
        if (!expand || !(expand instanceof HTMLElement)) {
          return false;
        }

        const iconContainer = expand.querySelector(
          `.${expandClassNames.iconContainer}`,
        ) as HTMLElement;

        if (iconContainer && iconContainer.focus) {
          const { tr } = state;
          const pos = state.selection.from;
          tr.setSelection(new TextSelection(tr.doc.resolve(pos)));
          if (dispatch) {
            dispatch(tr);
          }
          editorView.dom.blur();
          iconContainer.focus();
        }

        return true;
      }

      return false;
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.moveUp.common!,
    (state, dispatch, editorView) => {
      const queryMark = findTypeAheadQuery(state);
      if ((queryMark.start !== -1 && queryMark.end !== -1) || !editorView) {
        return false;
      }
      const { selection, schema } = state;
      const { nodeBefore } = selection.$from;
      if (
        selection instanceof GapCursorSelection &&
        selection.side === Side.RIGHT &&
        nodeBefore &&
        (nodeBefore.type === schema.nodes.expand ||
          nodeBefore.type === schema.nodes.nestedExpand) &&
        !nodeBefore.attrs.__expanded
      ) {
        const { $from } = selection;
        return focusTitle(editorView, Math.max($from.pos - 1, 0));
      }

      const { $from } = state.selection;
      if (editorView.endOfTextblock('up')) {
        const expand = findExpand(state);
        const prevCursorPos = Math.max($from.pos - $from.parentOffset - 1, 0);
        // move cursor from expand's content to its title
        if (expand && expand.start === prevCursorPos) {
          return focusTitle(editorView, expand.start);
        }

        const sel = Selection.findFrom(state.doc.resolve(prevCursorPos), -1);
        const expandBefore = findExpand(state, sel);
        if (sel && expandBefore) {
          // moving cursor from outside of an expand to the title when it is collapsed
          if (!expandBefore.node.attrs.__expanded) {
            return focusTitle(editorView, expandBefore.start);
          }
          // moving cursor from outside of an expand to the content when it is expanded
          else if (dispatch) {
            dispatch(state.tr.setSelection(sel));
          }
          return true;
        }
      }

      return false;
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.moveDown.common!,
    (state, dispatch, editorView) => {
      if (!editorView) {
        return false;
      }
      const { expand, nestedExpand } = state.schema.nodes;
      const { selection } = state;
      const { nodeAfter } = selection.$from;

      if (
        selection instanceof GapCursorSelection &&
        selection.side === Side.LEFT &&
        nodeAfter &&
        (nodeAfter.type === expand || nodeAfter.type === nestedExpand) &&
        !nodeAfter.attrs.__expanded
      ) {
        const { $from } = selection;
        return focusTitle(editorView, $from.pos + 1);
      }

      if (editorView.endOfTextblock('down')) {
        const { $from } = state.selection;
        const $after = state.doc.resolve($from.after());
        if (
          $after.nodeAfter &&
          ($after.nodeAfter.type === expand ||
            $after.nodeAfter.type === nestedExpand)
        ) {
          return focusTitle(editorView, $after.pos + 1);
        }
      }
      return false;
    },
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.backspace.common!,
    (state, dispatch, editorView) => {
      const { selection } = state;
      if (!editorView || !selection.empty) {
        return false;
      }
      const { expand, nestedExpand } = state.schema.nodes;
      const expandNode = findExpand(state);
      if (!expandNode) {
        // @see ED-7977
        const sel = Selection.findFrom(
          state.doc.resolve(Math.max(selection.$from.pos - 1, 0)),
          -1,
        );
        const expandBefore = findExpand(state, sel);
        if (
          expandBefore &&
          (expandBefore.node.type === expand ||
            expandBefore.node.type === nestedExpand) &&
          !expandBefore.node.attrs.__expanded
        ) {
          return focusTitle(editorView, expandBefore.start);
        }
        return false;
      }
      const textSel = Selection.findFrom(
        state.doc.resolve(expandNode.pos),
        1,
        true,
      );
      if (
        textSel &&
        selection.$from.pos === textSel.$from.pos &&
        isEmptyNode(state.schema)(expandNode.node) &&
        dispatch
      ) {
        return deleteExpand()(state, dispatch);
      }

      return false;
    },
    list,
  );

  return keymap(list);
}
