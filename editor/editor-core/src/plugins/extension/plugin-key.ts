import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { ExtensionState } from './types';

export const pluginKey = new PluginKey<ExtensionState>('extensionPlugin');
