/**
 * A plugin for ensuring tables always have unique local IDs, and to
 * preserve/not regenerate them when they are being cut and paste around the
 * document.
 *
 * More broadly, this plugin should be generalised so it can solve this ‘unique
 * id’ problem across the codebase for any node, but for now this will live on
 * its own solving only for tables.
 *
 * TODO: https://product-fabric.atlassian.net/browse/ED-12714
 *
 */
import { Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { uuid } from '@atlaskit/adf-schema';

import { nodesBetweenChanged } from '../../../utils';
import { stepHasSlice } from '../../../utils/step';
import { Schema, NodeType, Node as ProseMirrorNode } from 'prosemirror-model';
import { Step } from 'prosemirror-transform';

interface TableLocalIdPluginState {}

const pluginKey = new PluginKey<TableLocalIdPluginState>('tableLocalIdPlugin');

function stepAdds(step: Step, nodeType: NodeType): boolean {
  let adds = false;
  if (stepHasSlice(step)) {
    step.slice.content.descendants(node => {
      if (node?.type?.name === nodeType.name) {
        adds = true;
      }
      return !adds;
    });
  }
  return adds;
}

/**
 * Traverses a transaction's steps to see if we're inserting any tables
 */
const checkIsAddingTable = (transaction: Transaction, schema: Schema) => {
  return transaction.steps.some(step => stepAdds(step, schema.nodes.table));
};

/**
 * Checks a given doc for any localIds observed in table nodes
 */
const getTableIds = (doc: ProseMirrorNode, nodeType: NodeType) => {
  const ids = new Set<string>();
  doc.descendants(node => {
    const isNodeType = node.type === nodeType;
    if (isNodeType && node.attrs.localId) {
      ids.add(node.attrs.localId);
    }
    return !isNodeType;
  });
  return ids;
};

/**
 * Ensures uniqueness of `localId`s on tables being created or edited
 */
const createPlugin = () =>
  new Plugin<TableLocalIdPluginState>({
    key: pluginKey,
    appendTransaction: (transactions, oldState, newState) => {
      let modified = false;
      const tr = newState.tr;
      const { table } = newState.schema.nodes;

      // We must do this on every appendTransaction, as we need the previous
      // state at this point
      const idsObservedInPreviousDoc = getTableIds(oldState.doc, table);

      transactions.forEach(transaction => {
        if (!transaction.docChanged) {
          return;
        }
        // Don't interfere with cut as it clashes with fixTables & we don't need
        // to handle any extra cut cases in this plugin
        const uiEvent = transaction.getMeta('uiEvent');
        if (uiEvent === 'cut') {
          return;
        }

        /** Check if we're actually inserting a table, otherwise we can ignore this tr */
        const isAddingTable = checkIsAddingTable(transaction, newState.schema);
        if (!isAddingTable) {
          return;
        }

        // Ensures uniqueness for all table nodes
        nodesBetweenChanged(transaction, (node, pos) => {
          if (!!node.type && node.type === table) {
            const { localId, ...rest } = node.attrs;
            if (
              // Fallback incase table gets created without a localId
              !localId ||
              // Here is our main concern - to re-generate UUID if localId
              // already exists in the doc
              idsObservedInPreviousDoc?.has(localId)
            ) {
              tr.setNodeMarkup(pos, undefined, {
                localId: uuid.generate(),
                ...rest,
              });
              modified = true;
            }
          }
        });
      });
      if (modified) {
        return tr;
      }
      return;
    },
  });

export { createPlugin };
