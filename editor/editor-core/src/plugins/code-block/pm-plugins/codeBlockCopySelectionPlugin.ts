import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import type {
  EditorState,
  ReadonlyTransaction,
  Transaction,
} from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { getSelectedNodeOrNodeParentByNodeType } from '../../copy-button/utils';

export const copySelectionPluginKey = new PluginKey(
  'codeBlockCopySelectionPlugin',
);

type CodeBlockCopySelectionPluginState = {
  decorationStartAndEnd?: [start: number, end: number];
};

function getSelectionDecorationStartAndEnd({
  state,
  transaction,
}: {
  state: EditorState;
  transaction: ReadonlyTransaction;
}) {
  const codeBlockNode = getSelectedNodeOrNodeParentByNodeType({
    nodeType: state.schema.nodes.codeBlock,
    selection: transaction.selection,
  });

  if (!codeBlockNode) {
    return { decorationStartAndEnd: undefined };
  }

  const decorationStartAndEnd: CodeBlockCopySelectionPluginState['decorationStartAndEnd'] = [
    codeBlockNode.start,
    codeBlockNode.start + codeBlockNode.node.nodeSize,
  ];

  return { decorationStartAndEnd };
}

export function codeBlockCopySelectionPlugin() {
  return new SafePlugin({
    key: copySelectionPluginKey,
    state: {
      init(): CodeBlockCopySelectionPluginState {
        return { decorationStartAndEnd: undefined };
      },
      apply(
        transaction,
        currentCodeBlockCopySelectionPluginState: CodeBlockCopySelectionPluginState,
        _oldState,
        newState,
      ): CodeBlockCopySelectionPluginState {
        switch (transaction.getMeta(copySelectionPluginKey)) {
          case 'show-selection': {
            return getSelectionDecorationStartAndEnd({
              state: newState,
              transaction,
            });
          }
          case 'remove-selection':
            return { decorationStartAndEnd: undefined };
          default:
            // The contents of the code block can change while the selection is being shown
            // (either from collab edits -- or from the user continuing to type while hovering
            // the mouse over the copy button).
            // This ensures the selection is updated in these cases.
            if (
              currentCodeBlockCopySelectionPluginState.decorationStartAndEnd !==
              undefined
            ) {
              return getSelectionDecorationStartAndEnd({
                state: newState,
                transaction,
              });
            }
            return currentCodeBlockCopySelectionPluginState;
        }
      },
    },
    props: {
      decorations(state) {
        if (copySelectionPluginKey.getState(state).decorationStartAndEnd) {
          const [start, end] = copySelectionPluginKey.getState(
            state,
          ).decorationStartAndEnd;

          return DecorationSet.create(state.doc, [
            Decoration.inline(start, end, {
              class: 'ProseMirror-fake-text-selection',
            }),
          ]);
        }

        return DecorationSet.empty;
      },
    },
  });
}

export function provideVisualFeedbackForCopyButton(
  state: EditorState,
  dispatch?: (tr: Transaction) => void,
) {
  const tr = state.tr;
  tr.setMeta(copySelectionPluginKey, 'show-selection');

  // note: dispatch should always be defined when called from the
  // floating toolbar. Howver the Command type which the floating toolbar
  // uses suggests it's optional.
  // Using the type here to protect against future refactors of the
  // floating toolbar
  if (dispatch) {
    dispatch(tr);
  }

  return true;
}

export function removeVisualFeedbackForCopyButton(
  state: EditorState,
  dispatch?: (tr: Transaction) => void,
) {
  const tr = state.tr;
  tr.setMeta(copySelectionPluginKey, 'remove-selection');

  // note: dispatch should always be defined when called from the
  // floating toolbar. Howver the Command type which the floating toolbar
  // uses suggests it's optional.
  // Using the type here to protect against future refactors of the
  // floating toolbar
  if (dispatch) {
    dispatch(tr);
  }

  return true;
}
