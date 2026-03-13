import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { MentionPluginState } from '../types';

export const mentionPluginKey: PluginKey<MentionPluginState> = new PluginKey<MentionPluginState>(
	'mentionPlugin',
);
