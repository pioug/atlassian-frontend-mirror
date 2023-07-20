import { PluginKey } from 'prosemirror-state';

import { TablePluginState } from '../types';

export const pluginKey = new PluginKey<TablePluginState>('tablePlugin');
