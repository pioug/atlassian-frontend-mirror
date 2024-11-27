import { type Transaction } from '@atlaskit/editor-prosemirror/state';

import { pluginKey } from '../contextPanelPlugin';

export const applyChange = (tr: Transaction): Transaction =>
	tr.setMeta(pluginKey, { changed: true });
