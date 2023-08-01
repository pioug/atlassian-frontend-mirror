import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { ResolvedPos, Schema } from '@atlaskit/editor-prosemirror/model';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
  EditorState,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { Selection } from '@atlaskit/editor-prosemirror/state';
import {
  findParentNodeOfTypeClosestToPos,
  hasParentNodeOfType,
} from '@atlaskit/editor-prosemirror/utils';
import { getCursor, isEmptyNode, pipe } from '../../../utils';
import type { CommandDispatch } from '../../../types';

const deleteCurrentItem =
  ($from: ResolvedPos) =>
  (tr: Transaction): Transaction => {
    return tr.delete($from.before($from.depth), $from.after($from.depth));
  };

const setTextSelection =
  (pos: number) =>
  (tr: Transaction): Transaction => {
    const newSelection = Selection.findFrom(tr.doc.resolve(pos), -1, true);
    if (newSelection) {
      tr.setSelection(newSelection);
    }
    return tr;
  };

export function keymapPlugin(schema: Schema): SafePlugin | undefined {
  return keymap({
    Backspace: (state: EditorState, dispatch?: CommandDispatch) => {
      const $cursor = getCursor(state.selection);
      const { paragraph, codeBlock, listItem, table, layoutColumn } =
        state.schema.nodes;
      if (!$cursor || $cursor.parent.type !== codeBlock || !dispatch) {
        return false;
      }

      if (
        $cursor.pos === 1 ||
        (hasParentNodeOfType(listItem)(state.selection) &&
          $cursor.parentOffset === 0)
      ) {
        const node = findParentNodeOfTypeClosestToPos($cursor, codeBlock);

        if (!node) {
          return false;
        }

        dispatch(
          state.tr
            .setNodeMarkup(node.pos, node.node.type, node.node.attrs, [])
            .setBlockType($cursor.pos, $cursor.pos, paragraph),
        );
        return true;
      }
      if (
        $cursor.node &&
        isEmptyNode(schema)($cursor.node()) &&
        (hasParentNodeOfType(layoutColumn)(state.selection) ||
          hasParentNodeOfType(table)(state.selection))
      ) {
        const { tr } = state;
        const insertPos = $cursor.pos;
        dispatch(
          pipe(
            deleteCurrentItem($cursor),
            setTextSelection(insertPos),
          )(tr).scrollIntoView(),
        );

        return true;
      }

      // Handle not nested empty code block
      if (isEmptyNode(schema)($cursor.node())) {
        dispatch(deleteCurrentItem($cursor)(state?.tr));
        return true;
      }

      return false;
    },
  }) as SafePlugin;
}

export default keymapPlugin;
