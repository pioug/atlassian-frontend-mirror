import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { TablePluginState } from '../types';

export const pluginKey = new PluginKey<TablePluginState>('tablePlugin');
