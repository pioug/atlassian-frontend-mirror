import type {
  NodeType,
  Node as PMNode,
} from '@atlaskit/editor-prosemirror/model';
import type {
  EditorState,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import {
  NodeSelection,
  TextSelection,
} from '@atlaskit/editor-prosemirror/state';
import { hasParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';

export const insertBlock = (
  state: EditorState,
  nodeType: NodeType,
  start: number,
  end: number,
  attrs?: { [key: string]: any },
): Transaction | null => {
  // To ensure that match is done after HardBreak.
  const { hardBreak, codeBlock, listItem } = state.schema.nodes;
  const $pos = state.doc.resolve(start);
  if ($pos.nodeAfter!.type !== hardBreak) {
    return null;
  }

  // To ensure no nesting is done. (unless we're inserting a codeBlock inside lists)
  if (
    $pos.depth > 1 &&
    !(nodeType === codeBlock && hasParentNodeOfType(listItem)(state.selection))
  ) {
    return null;
  }

  // Split at the start of autoformatting and delete formatting characters.
  let tr = state.tr.delete(start, end).split(start);
  let currentNode = tr.doc.nodeAt(start + 1);

  // If node has more content split at the end of autoformatting.
  let nodeHasMoreContent = false;
  tr.doc.nodesBetween(
    start,
    start + (currentNode as PMNode).nodeSize,
    (node, pos) => {
      if (!nodeHasMoreContent && node.type === hardBreak) {
        nodeHasMoreContent = true;
        tr = tr.split(pos + 1).delete(pos, pos + 1);
      }
    },
  );
  if (nodeHasMoreContent) {
    currentNode = tr.doc.nodeAt(start + 1);
  }

  // Create new node and fill with content of current node.
  const { blockquote, paragraph } = state.schema.nodes;
  let content;
  let depth;
  if (nodeType === blockquote) {
    depth = 3;
    content = [paragraph.create({}, (currentNode as PMNode).content)];
  } else {
    depth = 2;
    content = (currentNode as PMNode).content;
  }
  const newNode = nodeType.create(attrs, content);

  // Add new node.
  tr = tr
    .setSelection(new NodeSelection(tr.doc.resolve(start + 1)))
    .replaceSelectionWith(newNode!)
    .setSelection(new TextSelection(tr.doc.resolve(start + depth)));
  return tr;
};
