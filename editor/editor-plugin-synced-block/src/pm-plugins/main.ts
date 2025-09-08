import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

export const syncedBlockPluginKey = new PluginKey('syncedBlockPlugin');

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type SyncedBlockPluginState = {};

export const createPlugin = () => {
	return new SafePlugin<SyncedBlockPluginState>({
		key: syncedBlockPluginKey,
		state: {
			init() {
				return {};
			},
			apply: (tr, currentPluginState) => {
				const meta = tr.getMeta(syncedBlockPluginKey);
				if (meta) {
					return meta;
				}
				return currentPluginState;
			},
		},
	});
};
