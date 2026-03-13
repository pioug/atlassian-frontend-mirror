import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { FindReplacePluginState } from '../types';

export const findReplacePluginKey: PluginKey<FindReplacePluginState> =
	new PluginKey<FindReplacePluginState>('findReplace');
