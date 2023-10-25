// File has been copied to packages/editor/editor-plugin-ai/src/provider/prosemirror-transformer/tableSerializer.ts
// If changes are made to this file, please make the same update in the linked file.

import type { MarkdownSerializerState } from '@atlaskit/editor-prosemirror/markdown';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { getOrderFromOrderedListNode } from '@atlaskit/editor-common/utils';
// TODO: Check if this needs to go to utils instead
import { generateOuterBacktickChain } from './serializer';

const isHeaderRow = (row: PMNode): boolean =>
  row.child(0).type.name === 'tableHeader';

const isHeaderRowPresent = (table: PMNode): boolean => {
  let headerRowPresent = false;
  table.content.forEach((row: PMNode) => {
    if (isHeaderRow(row)) {
      headerRowPresent = true;
    }
  });
  return headerRowPresent;
};

const renderNode = (
  state: MarkdownSerializerState,
  node: PMNode,
  index: number,
): void => {
  if (index > 0) {
    state.write(' ');
  }
  node.content.forEach((child: PMNode, i: number) => {
    const specialNodes = editorNodesForTable[child.type.name];
    if (specialNodes) {
      specialNodes(state, child, node, index);
    } else if (child.isTextblock || child.type.name === 'mediaSingle') {
      if (i > 0) {
        state.write(' ');
      }
      (state as any).context.insideTable = true;
      state.renderInline(child);
      (state as any).context.insideTable = false;
    } else {
      renderNode(state, child, i);
    }
  });
};

/**
 * This object has considerable overlap with editorNodes
 * in packages/editor/editor-bitbucket-transformer/src/serializer.ts
 * Once the appropriate nodes have been covered, it would be best to
 * consolidate the two.
 */
const editorNodesForTable: Record<string, any> = {
  blockquote(state: MarkdownSerializerState, node: PMNode) {
    state.wrapBlock('> ', undefined, node, () => state.renderContent(node));
  },
  codeBlock(state: MarkdownSerializerState, node: PMNode) {
    const backticks = generateOuterBacktickChain(node.textContent, 3);
    state.write(backticks + (node.attrs.language || '') + '\n');
    state.text(node.textContent ? node.textContent : '\u200c', false);
    state.ensureNewLine();
    state.write(backticks);
    state.closeBlock(node);
  },
  bulletList(state: MarkdownSerializerState, node: PMNode) {
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      state.render(child, node, i);
    }
  },
  orderedList(state: MarkdownSerializerState, node: PMNode) {
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      state.render(child, node, i);
    }
  },
  listItem(
    state: MarkdownSerializerState,
    node: PMNode,
    parent: PMNode,
    index: number,
  ) {
    const order = getOrderFromOrderedListNode(parent);
    const delimiter =
      parent.type.name === 'bulletList' ? '* ' : `${order + index}. `;
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      // if  at second child or more of list item, add a newline
      if (i > 0) {
        state.write('\n');
      }
      // if at first child of list item, add delimiter (e.g "1.").
      // if at second child or more of list item, only add spacing (not delimiter)
      if (i === 0) {
        state.wrapBlock('  ', delimiter, node, () =>
          state.render(child, parent, i),
        );
      } else {
        state.wrapBlock('    ', undefined, node, () =>
          state.render(child, parent, i),
        );
      }
      if (child.type.name === 'paragraph' && i > 0) {
        state.write('\n');
      }
      state.flushClose(1);
    }
    // if we're at the final list item, add a final closing newline
    if (index === parent.childCount - 1) {
      state.write('\n');
    }
  },
};

const renderInlineContent = (state: MarkdownSerializerState, node: PMNode) => {
  state.write('| ');
  renderNode(state, node, 0);
  state.write(' ');
};

export default {
  table(state: MarkdownSerializerState, node: PMNode) {
    if (isHeaderRowPresent(node)) {
      node.content.forEach((child, i) => state.render(child, node, i));
      state.closeBlock(node);
    }
  },
  tableRow(state: MarkdownSerializerState, node: PMNode) {
    node.content.forEach((child, i) => {
      state.render(child, node, i);
    });
    state.write('|');
    state.ensureNewLine();
    if (isHeaderRow(node)) {
      for (let i = 0; i < node.childCount; i++) {
        state.write('| --- ');
      }
      state.write('|');
      state.ensureNewLine();
    }
  },
  tableHeader: renderInlineContent,
  tableCell: renderInlineContent,
};
