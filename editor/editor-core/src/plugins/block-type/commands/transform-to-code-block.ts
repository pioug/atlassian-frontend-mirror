import { EditorState, Transaction } from 'prosemirror-state';
import { mapSlice } from '../../../utils/slice';
import { Mark } from 'prosemirror-model';

export function transformToCodeBlockAction(
  state: EditorState,
  attrs?: any,
): Transaction {
  if (!state.selection.empty) {
    // Don't do anything, if there is something selected
    return state.tr;
  }

  const codeBlock = state.schema.nodes.codeBlock;
  const startOfCodeBlockText = state.selection.$from;
  const parentPos = startOfCodeBlockText.before();
  const end = startOfCodeBlockText.end();

  const codeBlockSlice = mapSlice(
    state.doc.slice(startOfCodeBlockText.pos, end),
    node => {
      if (node.type === state.schema.nodes.hardBreak) {
        return state.schema.text('\n');
      }

      if (node.isText) {
        return node.mark([]);
      } else if (node.isInline) {
        return node.attrs.text ? state.schema.text(node.attrs.text) : null;
      } else {
        return node.content.childCount ? node.content : null;
      }
    },
  );

  const tr = state.tr.replaceRange(
    startOfCodeBlockText.pos,
    end,
    codeBlockSlice,
  );
  // If our offset isnt at 3 (backticks) at the start of line, cater for content.
  if (startOfCodeBlockText.parentOffset >= 3) {
    return tr.split(startOfCodeBlockText.pos, undefined, [
      { type: codeBlock, attrs },
    ]);
  }
  // TODO: Check parent node for valid code block marks, ATM It's not necessary because code block doesn't have any valid mark.
  const codeBlockMarks: Array<Mark> = [];
  return tr.setNodeMarkup(parentPos, codeBlock, attrs, codeBlockMarks);
}

export function isConvertableToCodeBlock(state: EditorState): boolean {
  // Before a document is loaded, there is no selection.
  if (!state.selection) {
    return false;
  }

  const { $from } = state.selection;
  const node = $from.parent;

  if (!node.isTextblock || node.type === state.schema.nodes.codeBlock) {
    return false;
  }

  const parentDepth = $from.depth - 1;
  const parentNode = $from.node(parentDepth);
  const index = $from.index(parentDepth);

  return parentNode.canReplaceWith(
    index,
    index + 1,
    state.schema.nodes.codeBlock,
  );
}
