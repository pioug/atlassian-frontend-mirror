import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { FloatingToolbarPluginData } from '../../floatingToolbarPluginType';

export const pluginKey: PluginKey<FloatingToolbarPluginData> =
	new PluginKey<FloatingToolbarPluginData>('floatingToolbarData');
