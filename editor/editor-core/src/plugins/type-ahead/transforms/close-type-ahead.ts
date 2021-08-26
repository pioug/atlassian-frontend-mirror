import { Transaction } from 'prosemirror-state';
import { pluginKey } from '../pm-plugins/key';
import { ACTIONS } from '../pm-plugins/actions';

export const closeTypeAhead = (tr: Transaction): Transaction => {
  return tr.setMeta(pluginKey, {
    action: ACTIONS.CLOSE_TYPE_AHEAD,
  });
};
