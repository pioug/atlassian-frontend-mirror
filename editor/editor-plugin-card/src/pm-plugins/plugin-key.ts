import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import { type CardPluginState } from '../types';

export const pluginKey: PluginKey<CardPluginState> = new PluginKey<CardPluginState>('cardPlugin');
