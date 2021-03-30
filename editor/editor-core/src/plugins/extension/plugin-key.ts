import { PluginKey } from 'prosemirror-state';
import type { ExtensionState } from './types';

export const pluginKey = new PluginKey<ExtensionState>('extensionPlugin');
