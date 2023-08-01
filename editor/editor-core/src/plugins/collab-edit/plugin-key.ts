import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { PluginState as CollabPluginState } from './plugin-state';

export const pluginKey = new PluginKey<CollabPluginState>('collabEditPlugin');
