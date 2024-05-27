import { type Node } from '@atlaskit/editor-prosemirror/model';
import {
  type EditorState,
  Plugin,
  PluginKey,
} from '@atlaskit/editor-prosemirror/state';
import { JQLSyntaxError } from '@atlaskit/jql-ast';

import getDocumentPosition from '../common/get-document-position';
import { getJastFromState } from '../jql-ast';

import { type Highlight } from './types';
import { SyntaxHighlightingVisitor } from './visitor';

const getHighlights = (state: EditorState): Highlight[] => {
  const ast = getJastFromState(state);
  // Get highlights for AST nodes
  const visitor = new SyntaxHighlightingVisitor(state);
  const highlights = ast.query ? visitor.visit(ast.query) : [];
  // Create a highlight for the first syntax error encountered
  const [error] = ast.errors;
  if (error instanceof JQLSyntaxError) {
    const documentFrom = getDocumentPosition(state.doc, error.start);
    const documentTo = getDocumentPosition(state.doc, error.stop);
    highlights.push({
      tokenType: 'error',
      documentFrom,
      documentTo,
    });
  }
  return highlights;
};

const JQLSyntaxHighlightingPluginKey = new PluginKey<Highlight[]>(
  'jql-syntax-highlighting-plugin',
);

const jqlSyntaxHighlightingPlugin = () =>
  new Plugin<Highlight[]>({
    key: JQLSyntaxHighlightingPluginKey,
    appendTransaction: (_, oldState, newState) => {
      // Avoid unnecessary transactions if document hasn't changed in the current transaction
      if (oldState.doc === newState.doc) {
        return;
      }

      const transaction = newState.tr;

      // Remove token marks from all inline nodes so they can be recomputed
      transaction.removeMark(0, newState.doc.content.size);

      // Create marks for computed highlights
      const highlights = getHighlights(newState);

      highlights.forEach(({ tokenType, documentFrom, documentTo }) => {
        // Apply mark to all text nodes within the highlighted range
        newState.doc.nodesBetween(
          documentFrom,
          documentTo,
          (node: Node, pos: number) => {
            if (node.isText) {
              const from = Math.max(pos, documentFrom);
              const to = Math.min(pos + node.nodeSize, documentTo);
              const mark = newState.schema.marks.token.create({ tokenType });
              transaction.addMark(from, to, mark);
            }
          },
        );
      });

      return transaction;
    },
  });

export default jqlSyntaxHighlightingPlugin;
