import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { FloatingToolbarPluginData } from '../../floatingToolbarPluginType';

export const pluginKey = new PluginKey<FloatingToolbarPluginData>('floatingToolbarData');
