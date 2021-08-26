import { Plugin } from 'prosemirror-state';
import { ACTIONS } from './actions';
import { isInsertionTransaction } from './utils';

export function createPlugin(): Plugin {
  return new Plugin({
    appendTransaction(transactions, _oldState, newState) {
      const insertItemCallback = isInsertionTransaction(
        transactions,
        ACTIONS.INSERT_ITEM,
      );
      if (insertItemCallback) {
        const tr = insertItemCallback(newState);
        if (tr) {
          return tr;
        }
      }
    },
  });
}
