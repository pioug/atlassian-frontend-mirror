import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { PluginState as CollabPluginState } from './plugin-state';

export const pluginKey: PluginKey<CollabPluginState> = new PluginKey<CollabPluginState>(
	'collabEditPlugin',
);
