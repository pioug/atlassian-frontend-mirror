import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { pluginKey } from './plugin-state';

export const showUrlToolbar = (tr: Transaction): Transaction =>
	tr.setMeta(pluginKey, { type: 'SHOW_URL_TOOLBAR' });

export const hideUrlToolbar = (tr: Transaction): Transaction =>
	tr.setMeta(pluginKey, { type: 'HIDE_URL_TOOLBAR' });
