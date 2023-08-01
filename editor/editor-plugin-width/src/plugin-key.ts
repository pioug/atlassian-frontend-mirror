import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { WidthPluginState } from './types';

export const pluginKey = new PluginKey<WidthPluginState>('widthPlugin');
