import { isDirtyTransaction } from '@atlaskit/editor-common/collab';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import type { Step } from '@atlaskit/editor-prosemirror/transform';
import { AddMarkStep } from '@atlaskit/editor-prosemirror/transform';

import type { LastOrganicChangeMetadata } from '../types';
import { isOrganicChange } from '../utils';

export const trackLastOrganicChangePluginKey = new PluginKey<LastOrganicChangeMetadata>(
	'collabTrackLastOrganicChangePlugin',
);

export const createPlugin = () => {
	return new SafePlugin<LastOrganicChangeMetadata>({
		key: trackLastOrganicChangePluginKey,
		state: {
			init() {
				return {
					lastLocalOrganicChangeAt: null,
					lastRemoteOrganicChangeAt: null,
					lastLocalOrganicBodyChangeAt: null,
					lastRemoteOrganicBodyChangeAt: null,
				};
			},
			apply(transaction: ReadonlyTransaction, prevPluginState: LastOrganicChangeMetadata) {
				if (Boolean(transaction.getMeta('appendedTransaction'))) {
					return prevPluginState;
				}

				const isRemote = Boolean(transaction.getMeta('isRemote'));
				const isDocumentReplaceFromRemote =
					isRemote && Boolean(transaction.getMeta('replaceDocument'));

				// Inline comment annotations are not considered as edits to the document body
				const isAnnotationStep = !!transaction.steps.find(
					(step: Step) => step instanceof AddMarkStep && step.mark?.type?.name === 'annotation',
				);

				if (isDocumentReplaceFromRemote) {
					return prevPluginState;
				}

				if (isDirtyTransaction(transaction)) {
					return prevPluginState;
				}

				if (isOrganicChange(transaction)) {
					if (isRemote) {
						return {
							lastLocalOrganicChangeAt: prevPluginState.lastLocalOrganicChangeAt,
							lastRemoteOrganicChangeAt: Date.now(),
							lastLocalOrganicBodyChangeAt: prevPluginState.lastLocalOrganicBodyChangeAt,
							lastRemoteOrganicBodyChangeAt: isAnnotationStep
								? prevPluginState.lastRemoteOrganicBodyChangeAt
								: Date.now(),
						};
					}
					return {
						lastLocalOrganicChangeAt: Date.now(),
						lastRemoteOrganicChangeAt: prevPluginState.lastRemoteOrganicChangeAt,
						lastLocalOrganicBodyChangeAt: isAnnotationStep
							? prevPluginState.lastLocalOrganicBodyChangeAt
							: Date.now(),
						lastRemoteOrganicBodyChangeAt: prevPluginState.lastRemoteOrganicBodyChangeAt,
					};
				}

				return prevPluginState;
			},
		},
	});
};
