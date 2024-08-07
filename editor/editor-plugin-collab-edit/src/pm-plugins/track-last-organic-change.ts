import { isDirtyTransaction } from '@atlaskit/editor-common/collab';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';

import type { LastOrganicChangeMetadata } from '../types';
import { isOrganicChange, originalTransactionHasMeta } from '../utils';

export const trackLastOrganicChangePluginKey = new PluginKey<LastOrganicChangeMetadata>(
	'collabTrackLastOrganicChangePlugin',
);

export const createPlugin = () => {
	return new SafePlugin<LastOrganicChangeMetadata>({
		key: trackLastOrganicChangePluginKey,
		state: {
			init() {
				return {
					lastOrganicChangeAt: null,
				};
			},
			apply(transaction: ReadonlyTransaction, prevPluginState: LastOrganicChangeMetadata) {
				const isRemote = originalTransactionHasMeta(transaction, 'isRemote');

				const isDocumentReplaceFromRemote =
					isRemote && originalTransactionHasMeta(transaction, 'replaceDocument');

				if (isDocumentReplaceFromRemote) {
					return prevPluginState;
				}

				if (isRemote || isDirtyTransaction(transaction)) {
					return prevPluginState;
				}

				if (isOrganicChange(transaction)) {
					return {
						lastOrganicChangeAt: Date.now(),
					};
				}

				return prevPluginState;
			},
		},
	});
};
