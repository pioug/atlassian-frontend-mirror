import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import { SyncClient } from './SyncClient';
import { findSyncedBlockParent } from './utils';

export const syncedBlockPluginKey = new PluginKey('syncedBlockPlugin');

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type SyncedBlockPluginState = {};

export const createPlugin = () => {
	const syncClient = new SyncClient();

	return new SafePlugin<SyncedBlockPluginState>({
		key: syncedBlockPluginKey,
		state: {
			init() {
				return {};
			},
			apply: (tr, currentPluginState) => {
				if (tr.docChanged) {
					const $pos = tr.selection.$from;
					const syncedBlockParent = findSyncedBlockParent($pos);

					if (syncedBlockParent) {
						const { node, attributes } = syncedBlockParent;
						const { sourceDocumentAri, contentAri, contentPropertyKey } = attributes.parameters;

						syncClient.syncContent({ sourceDocumentAri, contentAri, contentPropertyKey, node });
					}
				}

				const meta = tr.getMeta(syncedBlockPluginKey);
				if (meta) {
					return meta;
				}
				return currentPluginState;
			},
		},
	});
};
