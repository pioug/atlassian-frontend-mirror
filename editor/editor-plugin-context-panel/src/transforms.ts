import { Transaction } from 'prosemirror-state';

import { pluginKey } from './plugin';

export const applyChange = (tr: Transaction): Transaction =>
  tr.setMeta(pluginKey, { changed: true });
