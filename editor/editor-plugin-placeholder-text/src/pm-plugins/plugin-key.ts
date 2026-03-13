import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { PlaceholderTextPluginState } from '../placeholderTextPluginType';

export const pluginKey: PluginKey<PlaceholderTextPluginState> =
	new PluginKey<PlaceholderTextPluginState>('placeholderTextPlugin');
