import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { ExtensionState } from '../extensionPluginType';

export const pluginKey: PluginKey<ExtensionState> = new PluginKey<ExtensionState>(
	'extensionPlugin',
);
