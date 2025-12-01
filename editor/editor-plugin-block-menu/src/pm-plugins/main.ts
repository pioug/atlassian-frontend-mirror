import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { FLAG_ID } from '../blockMenuPluginType';

export const blockMenuPluginKey = new PluginKey('blockMenuPlugin');

type BlockMenuPluginState = {
	showFlag: FLAG_ID | false;
};

export const createPlugin = () => {
	return new SafePlugin<BlockMenuPluginState>({
		key: blockMenuPluginKey,
		state: {
			init() {
				return {
					showFlag: false,
				};
			},

			apply: (tr, currentPluginState) => {
				const meta = tr.getMeta(blockMenuPluginKey);

				return {
					showFlag: meta?.showFlag ?? currentPluginState.showFlag,
				};
			},
		},
	});
};
