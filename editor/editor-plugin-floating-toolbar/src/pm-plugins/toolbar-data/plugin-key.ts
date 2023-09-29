import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { FloatingToolbarPluginData } from '../../types';

export const pluginKey = new PluginKey<FloatingToolbarPluginData>(
  'floatingToolbarData',
);
