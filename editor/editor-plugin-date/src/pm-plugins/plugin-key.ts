import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { DatePluginState } from './types';

export const pluginKey: PluginKey<DatePluginState> = new PluginKey<DatePluginState>('datePlugin');
