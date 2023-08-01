import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { PluginState } from './types';

export const pluginKey = new PluginKey<PluginState>('placeholderTextPlugin');
