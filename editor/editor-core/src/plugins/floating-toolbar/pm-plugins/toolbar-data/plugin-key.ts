import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { FloatingToolbarPluginData } from '@atlaskit/editor-plugin-floating-toolbar';

export const pluginKey = new PluginKey<FloatingToolbarPluginData>(
  'floatingToolbarData',
);
