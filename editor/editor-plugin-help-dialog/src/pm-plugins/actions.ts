import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { pluginKey } from './plugin-key';

export const openHelpAction = (tr: Transaction) => {
	return tr.setMeta(pluginKey, true);
};

export const closeHelpAction = (tr: Transaction) => {
	return tr.setMeta(pluginKey, false);
};
