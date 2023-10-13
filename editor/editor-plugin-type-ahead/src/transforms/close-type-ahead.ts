import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { ACTIONS } from '../pm-plugins/actions';
import { pluginKey } from '../pm-plugins/key';

export const closeTypeAhead = (tr: Transaction): Transaction => {
  return tr.setMeta(pluginKey, {
    action: ACTIONS.CLOSE_TYPE_AHEAD,
  });
};
