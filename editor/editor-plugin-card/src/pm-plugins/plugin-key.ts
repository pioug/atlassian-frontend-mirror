import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import { CardPluginState } from '../types';

export const pluginKey = new PluginKey<CardPluginState>('cardPlugin');
