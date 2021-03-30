import { EditorState, Transaction, TextSelection } from 'prosemirror-state';
import { mapSlice } from '../../../utils/slice';
import { NodeType, Fragment } from 'prosemirror-model';

export function transformToCodeBlockAction(
  state: EditorState,
  attrs?: any,
): Transaction {
  if (!state.selection.empty) {
    // Don't do anything, if there is something selected
    return state.tr;
  }

  const codeBlock: NodeType = state.schema.nodes.codeBlock;
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

  const tr = state.tr;

  /**
   * If our offset isnt at 3 (backticks) at the start of line...
   * - replace the content after our cursor with codeBlockSlice
   * - split the node in two and turn the second half into a codeblock
   */
  if (startOfCodeBlockText.parentOffset >= 3) {
    tr.replaceRange(startOfCodeBlockText.pos, end, codeBlockSlice);
    return tr.split(startOfCodeBlockText.pos, undefined, [
      { type: codeBlock, attrs },
    ]);
  }

  /**
   * Otherwise replace the paragraph itself with a codeblock node
   * But by doing this we need to add back in the 2 backticks that
   * is deleted after this transaction returns in getCodeBlockRules()
   *
   * @see packages/editor/editor-core/src/plugins/block-type/pm-plugins/input-rule.ts
   */
  const doubleBacktick = Fragment.from(state.schema.text('``'));
  const codeBlockNode = codeBlock.createChecked(
    attrs,
    doubleBacktick.append(codeBlockSlice.content),
    [],
  );
  tr.replaceWith(
    parentPos,
    parentPos + startOfCodeBlockText.node().nodeSize,
    codeBlockNode,
  );
  // Reposition cursor when inserting into layouts or table headers
  return tr.setSelection(
    TextSelection.create(
      tr.doc,
      parentPos + startOfCodeBlockText.node().nodeSize - 1,
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
