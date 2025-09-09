import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

export const blockMenuPluginKey = new PluginKey('blockMenuPlugin');

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type BlockMenuPluginState = {};

export const createPlugin = () => {
	return new SafePlugin<BlockMenuPluginState>({
		key: blockMenuPluginKey,
		state: {
			init() {
				return {};
			},
			apply: (tr, currentPluginState) => {
				const meta = tr.getMeta(blockMenuPluginKey);
				if (meta) {
					return meta;
				}

				return currentPluginState;
			},
		},
	});
};
