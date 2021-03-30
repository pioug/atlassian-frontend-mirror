import { PluginKey } from 'prosemirror-state';
import { StickyPluginState } from './types';

export const pluginKey = new PluginKey<StickyPluginState>(
  'stickyHeadersPlugin',
);
