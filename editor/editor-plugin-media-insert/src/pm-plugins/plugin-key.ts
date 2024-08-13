import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { MediaInsertPluginState } from '../types';

export const pluginKey = new PluginKey<MediaInsertPluginState>('mediaInsertPlugin');
