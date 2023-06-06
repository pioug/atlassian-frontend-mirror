import { PluginKey } from 'prosemirror-state';

import type { WidthPluginState } from './types';

export const pluginKey = new PluginKey<WidthPluginState>('widthPlugin');
