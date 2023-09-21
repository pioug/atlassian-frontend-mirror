import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import {
  Selection,
  TextSelection,
  NodeSelection,
} from '@atlaskit/editor-prosemirror/state';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import {
  bindKeymapWithCommand,
  moveRight,
  moveLeft,
  moveUp,
  moveDown,
  tab,
  backspace,
} from '@atlaskit/editor-common/keymaps';
import { GapCursorSelection, Side } from '../../selection/gap-cursor-selection';
import { findExpand } from '../utils';
import { isEmptyNode } from '../../../utils';
import { expandClassNames } from '../ui/class-names';
import { deleteExpand, focusTitle } from '../commands';
import { getPluginState as getSelectionPluginState } from '../../selection/plugin-factory';
import { RelativeSelectionPos } from '../../selection/types';
import { isPositionNearTableRow } from '@atlaskit/editor-common/utils';

const isExpandNode = (node: PMNode) => {
  return node?.type.name === 'expand' || node?.type.name === 'nestedExpand';
};
const isExpandSelected = (selection: Selection) =>
  selection instanceof NodeSelection && isExpandNode(selection.node);

export function expandKeymap(): SafePlugin {
  const list = {};

  bindKeymapWithCommand(
    moveRight.common!,
    (state, dispatch, editorView) => {
      if (!editorView) {
        return false;
      }
      const { selection } = state;
      const { selectionRelativeToNode } = getSelectionPluginState(state);

      if (
        isExpandSelected(selection) &&
        selectionRelativeToNode === RelativeSelectionPos.Start
      ) {
        return focusTitle(selection.from + 1)(state, dispatch, editorView);
      }
      return false;
    },
    list,
  );

  bindKeymapWithCommand(
    moveLeft.common!,
    (state, dispatch, editorView) => {
      if (!editorView) {
        return false;
      }
      const { selection } = state;
      const { selectionRelativeToNode } = getSelectionPluginState(state);

      if (
        isExpandSelected(selection) &&
        (selectionRelativeToNode === undefined ||
          selectionRelativeToNode === RelativeSelectionPos.End)
      ) {
        return focusTitle(selection.from + 1)(state, dispatch, editorView);
      }

      return false;
    },
    list,
  );

  bindKeymapWithCommand(
    tab.common!,
    (state, dispatch, editorView) => {
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

  bindKeymapWithCommand(
    moveUp.common!,
    (state, dispatch, editorView) => {
      if (!editorView) {
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
        return focusTitle(Math.max($from.pos - 1, 0))(
          state,
          dispatch,
          editorView,
        );
      }

      const { $from } = state.selection;

      if (editorView.endOfTextblock('up')) {
        const expand = findExpand(state);

        // Moving UP in a table should move the cursor to the row above
        // however when an expand is in a table cell to the left of the
        // current table cell, arrow UP moves the cursor to the left
        // see ED-15425
        if (isPositionNearTableRow($from, schema, 'before') && !expand) {
          return false;
        }

        const prevCursorPos = Math.max($from.pos - $from.parentOffset - 1, 0);
        // move cursor from expand's content to its title
        if (expand && expand.start === prevCursorPos) {
          return focusTitle(expand.start)(state, dispatch, editorView);
        }

        const sel = Selection.findFrom(state.doc.resolve(prevCursorPos), -1);
        const expandBefore = findExpand(state, sel);
        if (sel && expandBefore) {
          // moving cursor from outside of an expand to the title when it is collapsed
          if (!expandBefore.node.attrs.__expanded) {
            return focusTitle(expandBefore.start)(state, dispatch, editorView);
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

  bindKeymapWithCommand(
    moveDown.common!,
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
        return focusTitle($from.pos + 1)(state, dispatch, editorView);
      }

      if (editorView.endOfTextblock('down')) {
        const { $from } = state.selection;

        if ($from.depth === 0) {
          return false;
        }
        const $after = state.doc.resolve($from.after());
        if (
          $after.nodeAfter &&
          ($after.nodeAfter.type === expand ||
            $after.nodeAfter.type === nestedExpand)
        ) {
          return focusTitle($after.pos + 1)(state, dispatch, editorView);
        }
      }
      return false;
    },
    list,
  );

  bindKeymapWithCommand(
    backspace.common!,
    (state, dispatch, editorView) => {
      const { selection } = state;
      const { $from } = selection;
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
          return focusTitle(expandBefore.start)(state, dispatch, editorView);
        }
        return false;
      }
      const parentNode = state.doc.nodeAt(
        $from.before(Math.max($from.depth - 1, 1)),
      );
      // ED-10012 catch cases where the expand has another node nested within it and
      // the backspace should be applied only to the inner node instead of the expand
      if (parentNode && !isExpandNode(parentNode)) {
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

  return keymap(list) as SafePlugin;
}
