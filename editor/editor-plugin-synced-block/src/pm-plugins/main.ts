import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { SyncBlockStoreManager } from '@atlaskit/editor-common/sync-block';
import type { ExtractInjectionAPI, PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import { lazySyncBlockView } from '../nodeviews/lazySyncedBlock';
import type { SyncedBlockPlugin, SyncedBlockPluginOptions } from '../syncedBlockPluginType';

export const syncedBlockPluginKey = new PluginKey('syncedBlockPlugin');

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type SyncedBlockPluginState = {};

export const createPlugin = (
	options: SyncedBlockPluginOptions | undefined,
	pmPluginFactoryParams: PMPluginFactoryParams,
	_syncBlockStore: SyncBlockStoreManager,
	api?: ExtractInjectionAPI<SyncedBlockPlugin>,
) => {
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
		props: {
			nodeViews: {
				syncBlock: lazySyncBlockView({ options, pmPluginFactoryParams, api }),
			},
		},
	});
};
