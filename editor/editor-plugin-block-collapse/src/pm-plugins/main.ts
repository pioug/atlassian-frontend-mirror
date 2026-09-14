import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';

import { handleArrowKey } from './keyboard-navigation';
import { blockCollapsePluginKey } from './plugin-key';
import { createInitialPluginState, updatePluginState } from './plugin-state';
import type { BlockCollapseAction, BlockCollapsePluginState } from './types';

const apply = (
	tr: ReadonlyTransaction,
	pluginState: BlockCollapsePluginState,
): BlockCollapsePluginState => {
	const action = tr.getMeta(blockCollapsePluginKey) as BlockCollapseAction | undefined;
	if (!action && !tr.docChanged) {
		return pluginState;
	}

	return updatePluginState(tr, pluginState, action);
};

export const createPlugin = (): SafePlugin<BlockCollapsePluginState> =>
	new SafePlugin<BlockCollapsePluginState>({
		key: blockCollapsePluginKey,
		state: {
			init: createInitialPluginState,
			apply,
		},
		props: {
			decorations: (state) => blockCollapsePluginKey.getState(state)?.decorations,
			handleKeyDown: handleArrowKey,
		},
	});
