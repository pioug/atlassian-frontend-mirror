import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { LayoutState } from './types';

export const pluginKey = new PluginKey<LayoutState>('layout');
