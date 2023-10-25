import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { PlaceholderTextPluginState } from './types';

export const pluginKey = new PluginKey<PlaceholderTextPluginState>(
  'placeholderTextPlugin',
);
