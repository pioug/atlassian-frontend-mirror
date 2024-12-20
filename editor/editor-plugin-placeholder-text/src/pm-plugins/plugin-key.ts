import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { PlaceholderTextPluginState } from '../placeholderTextPluginType';

export const pluginKey = new PluginKey<PlaceholderTextPluginState>('placeholderTextPlugin');
