import { PluginKey } from 'prosemirror-state';
import { ColumnResizingPluginState } from '../../types';

export const pluginKey = new PluginKey<ColumnResizingPluginState>(
  'tableFlexiColumnResizing',
);
