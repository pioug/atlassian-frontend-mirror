import { PluginKey } from 'prosemirror-state';
import { PluginState } from './types';

export const pluginKey = new PluginKey<PluginState>('placeholderTextPlugin');
