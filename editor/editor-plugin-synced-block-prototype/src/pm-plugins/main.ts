import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import { SyncClient } from './SyncClient';
import { findSyncedBlockParent } from './utils';

export const syncedBlockPrototypePluginKey = new PluginKey('syncedBlockPrototypePlugin');

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type syncedBlockPrototypePluginState = {};

export const createPlugin = () => {
	const syncClient = new SyncClient();

	return new SafePlugin<syncedBlockPrototypePluginState>({
		key: syncedBlockPrototypePluginKey,
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

				const meta = tr.getMeta(syncedBlockPrototypePluginKey);
				if (meta) {
					return meta;
				}
				return currentPluginState;
			},
		},
	});
};
