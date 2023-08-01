import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import { TablePluginState } from '../types';

export const pluginKey = new PluginKey<TablePluginState>('tablePlugin');
