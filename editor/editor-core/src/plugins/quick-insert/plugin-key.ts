import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { QuickInsertPluginState } from '@atlaskit/editor-common/types';

export const pluginKey = new PluginKey<QuickInsertPluginState>(
  'quickInsertPluginKey',
);
