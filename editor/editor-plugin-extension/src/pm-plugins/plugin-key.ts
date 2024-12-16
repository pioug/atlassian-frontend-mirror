import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { ExtensionState } from '../extensionPluginType';

export const pluginKey = new PluginKey<ExtensionState>('extensionPlugin');
