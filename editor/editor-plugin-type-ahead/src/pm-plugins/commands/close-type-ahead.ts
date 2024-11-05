import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { ACTIONS } from '../actions';
import { pluginKey } from '../key';

export const closeTypeAhead = (tr: Transaction): Transaction => {
	return tr.setMeta(pluginKey, {
		action: ACTIONS.CLOSE_TYPE_AHEAD,
	});
};
