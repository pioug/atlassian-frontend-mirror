import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { MediaInsertPluginState } from '../mediaInsertPluginType';

export const pluginKey = new PluginKey<MediaInsertPluginState>('mediaInsertPlugin');
