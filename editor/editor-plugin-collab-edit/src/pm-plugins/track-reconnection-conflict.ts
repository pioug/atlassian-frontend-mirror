import type { CollabEventConflictPayload } from '@atlaskit/editor-common/collab';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';

export const trackLastRemoteConflictPluginKey = new PluginKey<CollabEventConflictPayload>(
	'trackLastRemoteConflict',
);

export const createPlugin = () => {
	return new SafePlugin<CollabEventConflictPayload | undefined>({
		key: trackLastRemoteConflictPluginKey,
		state: {
			init() {
				return undefined;
			},
			apply(
				transaction: ReadonlyTransaction,
				prevPluginState: CollabEventConflictPayload | undefined,
			) {
				const metadata = transaction.getMeta(trackLastRemoteConflictPluginKey);
				if (metadata) {
					return metadata;
				}
				return prevPluginState;
			},
		},
	});
};
