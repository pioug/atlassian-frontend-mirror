import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { QuickInsertPluginState } from './types';

export const pluginKey = new PluginKey<QuickInsertPluginState>(
  'quickInsertPluginKey',
);
