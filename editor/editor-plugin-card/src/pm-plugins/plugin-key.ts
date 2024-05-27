import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import { type CardPluginState } from '../types';

export const pluginKey = new PluginKey<CardPluginState>('cardPlugin');
