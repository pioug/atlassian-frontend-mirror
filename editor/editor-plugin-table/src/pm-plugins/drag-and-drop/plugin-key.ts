import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { DragAndDropPluginState } from './types';

export const pluginKey = new PluginKey<DragAndDropPluginState>('dragAndDropPlugin');
