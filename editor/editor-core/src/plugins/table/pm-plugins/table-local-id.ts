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
import { Dispatch } from '../../../event-dispatcher';
import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';
import rafSchedule from 'raf-schd';

import { uuid } from '@atlaskit/adf-schema';

import { stepAdds } from '../../../utils/step';

interface TableLocalIdPluginState {
  // One time parse for initial load with existing tables without localIds
  parsedForLocalIds: boolean;
}

const pluginKey = new PluginKey<TableLocalIdPluginState>('tableLocalIdPlugin');
const getPluginState = (
  state: EditorState,
): TableLocalIdPluginState | undefined | null =>
  state && pluginKey.getState(state);

/**
 * Traverses a transaction's steps to see if we're inserting any tables
 */
const checkIsAddingTable = (transaction: Transaction, nodeType: NodeType) => {
  return transaction.steps.some((step) => stepAdds(step, nodeType));
};

/**
 * Ensures uniqueness of `localId`s on tables being created or edited
 */
const createPlugin = (dispatch: Dispatch) =>
  new Plugin<TableLocalIdPluginState>({
    key: pluginKey,
    state: {
      init() {
        return {
          parsedForLocalIds: false,
        };
      },
      apply(tr, pluginState) {
        const meta = tr.getMeta(pluginKey);
        if (meta) {
          const keys = Object.keys(meta) as Array<
            keyof TableLocalIdPluginState
          >;
          const changed = keys.some((key) => {
            return pluginState[key] !== meta[key];
          });

          if (changed) {
            const newState = { ...pluginState, ...meta };

            dispatch(pluginKey, newState);
            return newState;
          }
        }

        return pluginState;
      },
    },
    view: () => {
      return {
        /**
         * Utilise the update cycle for _one_ scan through an initial doc
         * to ensure existing tables without IDs get them when this plugin is
         * enabled.
         *
         * This entire block can be skipped if we simply remove the `checkIsAddingTable`
         * check in appendTransaction, but that comes with 2 cons:
         *
         * 1. require a transaction before we actually add the local IDs
         * 2. ever slightly more unncessary checks
         *
         * Finally, this never happens in practice when utilising this in
         * confluence, as the collab/synchrony initialisation process will
         * trigger a transaction which adds tables, and thus this plugin will
         * add/dedupe the necessary IDs. But general usage of the editor
         * without collab should still solve for IDs.
         */
        update(editorView) {
          const { state } = editorView;
          const pluginState = getPluginState(state);
          if (!pluginState) {
            return;
          }
          const parsed = pluginState.parsedForLocalIds;
          if (parsed) {
            return;
          }

          const { table } = state.schema.nodes;
          rafSchedule(() => {
            const tr = state.tr;
            let tableIdWasAdded = false;
            editorView.state.doc.descendants((node, pos) => {
              const isTable = node.type === table;
              const localId = node.attrs.localId;
              if (isTable && !localId) {
                tableIdWasAdded = true;
                tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  localId: uuid.generate(),
                });
                return false;
              }
              /**
               * Otherwise continue traversing, we can encounter tables nested in
               * expands/bodiedExtensions
               */
              return true;
            });
            if (tableIdWasAdded) {
              tr.setMeta('addToHistory', false);
              editorView.dispatch(tr);
            }
          })();

          editorView.dispatch(
            state.tr.setMeta(pluginKey, {
              parsedForLocalIds: true,
            }),
          );
        },
      };
    },
    appendTransaction: (transactions, _oldState, newState) => {
      let modified = false;
      const tr = newState.tr;
      const { table } = newState.schema.nodes;

      const idsObserved = new Set<string>();

      transactions.forEach((transaction) => {
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
