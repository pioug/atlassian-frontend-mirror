import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { StickyPluginState } from './types';

export const pluginKey = new PluginKey<StickyPluginState>('stickyHeadersPlugin');
