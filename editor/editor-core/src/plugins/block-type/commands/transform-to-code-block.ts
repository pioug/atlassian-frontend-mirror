import { EditorState, Transaction, TextSelection } from 'prosemirror-state';
import { mapSlice } from '../../../utils/slice';
import { NodeType } from 'prosemirror-model';

export function transformToCodeBlockAction(
  state: EditorState,
  start: number,
  end: number,
  attrs?: any,
): Transaction {
  if (!state.selection.empty) {
    // Don't do anything, if there is something selected
    return state.tr;
  }

  const startOfCodeBlockText = state.selection.$from;
  const endLinePosition = startOfCodeBlockText.end();
  const startLinePosition = startOfCodeBlockText.start();
  const parentStartPosition = startOfCodeBlockText.before();

  const codeBlockSlice = mapSlice(
    state.doc.slice(startOfCodeBlockText.pos, endLinePosition),
    (node) => {
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

  const tr = state.tr;

  // Replace current block node
  const startMapped = startLinePosition === start ? parentStartPosition : start;

  const codeBlock: NodeType = state.schema.nodes.codeBlock;
  const codeBlockNode = codeBlock.createChecked(attrs, codeBlockSlice.content);
  tr.replaceWith(
    startMapped,
    Math.min(endLinePosition, tr.doc.content.size),
    codeBlockNode,
  );

  // Reposition cursor when inserting into layouts or table headers
  const mapped = tr.doc.resolve(tr.mapping.map(startMapped) + 1);
  const selection = TextSelection.findFrom(mapped, 1, true);
  if (selection) {
    return tr.setSelection(selection);
  }

  return tr.setSelection(
    TextSelection.create(
      tr.doc,
      Math.min(
        start + startOfCodeBlockText.node().nodeSize - 1,
        tr.doc.content.size,
      ),
    ),
  );
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
