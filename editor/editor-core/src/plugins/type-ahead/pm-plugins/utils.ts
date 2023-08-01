import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { InsertionTransactionMeta } from '../types';
import type { ACTIONS } from './actions';
import { pluginKey } from './key';

export const isInsertionTransaction = (
  transactions: readonly Transaction[],
  action: ACTIONS,
): InsertionTransactionMeta | null => {
  const tr = transactions.find(
    (tr) => tr.getMeta(pluginKey)?.action === action,
  );
  if (!tr) {
    return null;
  }

  return tr.getMeta(pluginKey)?.params;
};
