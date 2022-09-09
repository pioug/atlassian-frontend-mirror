import { keymap } from 'prosemirror-keymap';
import {
  ResolvedPos,
  Node as PMNode,
  Schema,
  NodeType,
} from 'prosemirror-model';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { Selection, Transaction } from 'prosemirror-state';
import { setTextSelection, findParentNodeOfType } from 'prosemirror-utils';
import { Command } from '../../../types';
import { isEmptyNode } from '../../../utils';

function findParentNode(
  selection: Selection,
  nodeType: NodeType,
): PMNode | null {
  const parentPosition = findParentNodeOfType(nodeType)(selection);

  if (parentPosition) {
    return parentPosition.node;
  }

  return null;
}

function isInsideAnEmptyNode(
  selection: Selection,
  nodeType: NodeType,
  schema: Schema,
) {
  const parentNode = findParentNode(selection, nodeType);
  return parentNode && isEmptyNode(schema)(parentNode);
}

// Somewhat broken and subverted: https://product-fabric.atlassian.net/browse/ED-6504
export function keymapPlugin(): SafePlugin | undefined {
  const deleteCurrentItem = ($from: ResolvedPos, tr: Transaction) => {
    return tr.delete($from.before($from.depth) - 1, $from.end($from.depth) + 1);
  };

  const keymaps: Record<string, Command> = {
    Backspace: (state, dispatch) => {
      const {
        selection,
        schema: { nodes },
        tr,
      } = state;
      const { panel, blockquote } = nodes;

      const { $from, $to } = selection;
      // Don't do anything if selection is a range
      if ($from.pos !== $to.pos) {
        return false;
      }

      // If not at the start of a panel, no joining will happen so allow default behaviour (backspacing characters etc..)
      if ($from.parentOffset !== 0) {
        return false;
      }

      const previousPos = tr.doc.resolve(
        Math.max(0, $from.before($from.depth) - 1),
      );

      const previousNodeType =
        previousPos.pos > 0 && previousPos.parent && previousPos.parent.type;
      const parentNodeType = $from.parent.type;
      const isPreviousNodeAPanel = previousNodeType === panel;
      const isParentNodeAPanel = parentNodeType === panel;

      // Stops merging panels when deleting empty paragraph in between
      if (
        (isPreviousNodeAPanel && !isParentNodeAPanel) ||
        isInsideAnEmptyNode(selection, panel, state.schema) ||
        isInsideAnEmptyNode(selection, blockquote, state.schema)
      ) {
        const content = $from.node($from.depth).content;
        const insertPos = previousPos.pos;
        deleteCurrentItem($from, tr).insert(insertPos, content);
        if (dispatch) {
          dispatch(setTextSelection(insertPos)(tr).scrollIntoView());
        }
        return true;
      }

      const nodeType = $from.node().type;
      if (nodeType !== panel) {
        return false;
      }

      return true;
    },
  };
  return keymap(keymaps) as SafePlugin;
}

export default keymapPlugin;
