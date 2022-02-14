import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { ACTIONS } from './actions';
import { isInsertionTransaction } from './utils';

export function createPlugin(): SafePlugin {
  return new SafePlugin({
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
