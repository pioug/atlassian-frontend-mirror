import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import { getIsFormatMenuHidden } from './getIsFormatMenuHidden';

export const blockMenuPluginKey = new PluginKey('blockMenuPlugin');

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type BlockMenuPluginState = {
	isFormatMenuHidden: boolean;
};

export const createPlugin = () => {
	return new SafePlugin<BlockMenuPluginState>({
		key: blockMenuPluginKey,
		state: {
			init() {
				return { isFormatMenuHidden: false };
			},
			apply: (tr, currentPluginState) => {
				const meta = tr.getMeta(blockMenuPluginKey);
				if (meta) {
					return { ...currentPluginState, ...meta };
				}
				const isFormatMenuHidden = getIsFormatMenuHidden(tr);

				return { ...currentPluginState, isFormatMenuHidden };
			},
		},
	});
};
