import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { MediaEditingPluginState } from './types';

export const stateKey: PluginKey<MediaEditingPluginState> = new PluginKey<MediaEditingPluginState>(
	'mediaEditingPlugin',
);
