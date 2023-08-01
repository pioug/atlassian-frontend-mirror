import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import { ColumnResizingPluginState } from '../../types';

export const pluginKey = new PluginKey<ColumnResizingPluginState>(
  'tableFlexiColumnResizing',
);
