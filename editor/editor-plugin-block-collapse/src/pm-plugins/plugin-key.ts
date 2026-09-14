import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { BlockCollapsePluginState } from './types';

export const blockCollapsePluginKey: PluginKey<BlockCollapsePluginState> =
	new PluginKey<BlockCollapsePluginState>('blockCollapsePlugin');
