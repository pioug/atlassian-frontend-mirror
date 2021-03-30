import { PluginKey } from 'prosemirror-state';
import type { QuickInsertPluginState } from './types';

export const pluginKey = new PluginKey<QuickInsertPluginState>(
  'quickInsertPluginKey',
);
