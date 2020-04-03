import { Transaction } from 'prosemirror-state';
import { pluginKey } from './';

export const applyChange = (tr: Transaction): Transaction =>
  tr.setMeta(pluginKey, { changed: true });
