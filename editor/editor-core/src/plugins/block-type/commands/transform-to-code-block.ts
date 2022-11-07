import { EditorState, Transaction, TextSelection } from 'prosemirror-state';
import { mapSlice } from '../../../utils/slice';
import { Fragment, NodeType } from 'prosemirror-model';
import { timestampToString } from '@atlaskit/editor-common/utils';

export function transformToCodeBlockAction(
  state: EditorState,
  start: number,
  attrs?: any,
): Transaction {
  const startOfCodeBlockText = state.selection.$from;
  const endPosition = state.selection.empty
    ? startOfCodeBlockText.end()
    : state.selection.$to.pos;
  const startLinePosition = startOfCodeBlockText.start();
  //when cmd+A is used to select the content. start position should be 0.
  const parentStartPosition =
    startOfCodeBlockText.depth === 0 ? 0 : startOfCodeBlockText.before();
  const contentSlice = state.doc.slice(startOfCodeBlockText.pos, endPosition);

  const codeBlockSlice = mapSlice(contentSlice, (node, parent, index) => {
    if (node.type === state.schema.nodes.hardBreak) {
      return state.schema.text('\n');
    }

    if (node.isText) {
      return node.mark([]);
    }

    if (node.isInline) {
      // Convert dates
      if (node.attrs.timestamp) {
        return state.schema.text(timestampToString(node.attrs.timestamp, null));
      }
      // Convert links
      if (node.attrs.url) {
        return state.schema.text(node.attrs.url);
      }
      return node.attrs.text ? state.schema.text(node.attrs.text) : null;
    }

    // if the current node is the last child of the Slice exit early to prevent
    // adding additional line breaks
    if (contentSlice.content.childCount - 1 === index) {
      return node.content;
    }

    //useful to decide whether to append line breaks when the content has list items.
    const isParentLastChild =
      parent && contentSlice.content.childCount - 1 === index;

    // add line breaks at the end of each paragraph to mimic layout of selected content
    // do not add line breaks when the 'paragraph' parent is last child.
    if (
      node.content.childCount &&
      node.type === state.schema.nodes.paragraph &&
      !isParentLastChild
    ) {
      return node.content.append(Fragment.from(state.schema.text('\n\n')));
    }

    return node.content.childCount ? node.content : null;
  });

  const tr = state.tr;

  // Replace current block node
  const startMapped = startLinePosition === start ? parentStartPosition : start;

  const codeBlock: NodeType = state.schema.nodes.codeBlock;
  const codeBlockNode = codeBlock.createChecked(attrs, codeBlockSlice.content);
  tr.replaceWith(
    startMapped,
    Math.min(endPosition, tr.doc.content.size),
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
