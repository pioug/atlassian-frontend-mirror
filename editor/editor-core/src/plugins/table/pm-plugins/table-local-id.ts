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

import { stepAdds } from '../../../utils/step';
import { NodeType } from 'prosemirror-model';

interface TableLocalIdPluginState {}

const pluginKey = new PluginKey<TableLocalIdPluginState>('tableLocalIdPlugin');

/**
 * Traverses a transaction's steps to see if we're inserting any tables
 */
const checkIsAddingTable = (transaction: Transaction, nodeType: NodeType) => {
  return transaction.steps.some(step => stepAdds(step, nodeType));
};

/**
 * Ensures uniqueness of `localId`s on tables being created or edited
 */
const createPlugin = () =>
  new Plugin<TableLocalIdPluginState>({
    key: pluginKey,
    appendTransaction: (transactions, _oldState, newState) => {
      let modified = false;
      const tr = newState.tr;
      const { table } = newState.schema.nodes;

      const idsObserved = new Set<string>();

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
        const isAddingTable = checkIsAddingTable(transaction, table);
        if (!isAddingTable) {
          return;
        }

        // Can't simply look at changed nodes, as we could be adding a table
        newState.doc.descendants((node, pos) => {
          const isTable = node.type === table;
          const localId = node.attrs.localId;

          // Dealing with a table - make sure it's a unique ID
          if (isTable) {
            if (localId && !idsObserved.has(localId)) {
              idsObserved.add(localId);
              // Also add a localId if it happens to not have one,
            } else if (!localId || idsObserved.has(localId)) {
              modified = true;
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                localId: uuid.generate(),
              });
            }
            return false;
          }

          /**
           * Otherwise continue traversing, we can encounter tables nested in
           * expands/bodiedExtensions
           */
          return true;
        });
      });

      if (modified) {
        return tr;
      }
      return;
    },
  });

export { createPlugin };
