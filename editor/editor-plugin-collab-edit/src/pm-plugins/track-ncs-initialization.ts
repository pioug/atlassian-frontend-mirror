import { isDirtyTransaction } from '@atlaskit/editor-common/collab';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import type { Step } from '@atlaskit/editor-prosemirror/transform';
import { AddMarkStep } from '@atlaskit/editor-prosemirror/transform';

import type { CollabInitializedMetadata } from '../types';

export const trackNCSInitializationPluginKey = new PluginKey<CollabInitializedMetadata>(
	'collabTrackNCSInitializationPlugin',
);

const originalTransactionHasMeta = (
	transaction: Transaction | ReadonlyTransaction,
	metaTag: string,
): boolean => {
	const hasMetaTag = Boolean(transaction.getMeta(metaTag));
	if (hasMetaTag) {
		return true;
	}
	const appendedTransaction = transaction.getMeta('appendedTransaction');
	if (appendedTransaction instanceof Transaction) {
		return originalTransactionHasMeta(appendedTransaction, metaTag);
	}
	return false;
};

export const createPlugin = () => {
	return new SafePlugin<CollabInitializedMetadata>({
		key: trackNCSInitializationPluginKey,
		state: {
			init() {
				return {
					collabInitialisedAt: null,
					firstChangeAfterInitAt: null,
					firstContentBodyChangeAfterInitAt: null,
				};
			},
			apply(
				transaction: ReadonlyTransaction,
				prevPluginState: CollabInitializedMetadata,
				oldState: EditorState,
			) {
				if (Boolean(transaction.getMeta('collabInitialised'))) {
					return {
						collabInitialisedAt: Date.now(),
						firstChangeAfterInitAt: null,
						firstContentBodyChangeAfterInitAt: null,
					};
				}

				const shouldCheckDocument =
					prevPluginState.collabInitialisedAt && !prevPluginState.firstContentBodyChangeAfterInitAt;

				if (!shouldCheckDocument) {
					return prevPluginState;
				}

				const isRemote = originalTransactionHasMeta(transaction, 'isRemote');

				const isDocumentReplaceFromRemote =
					isRemote && originalTransactionHasMeta(transaction, 'replaceDocument');

				if (isDocumentReplaceFromRemote) {
					return prevPluginState;
				}

				if (isDirtyTransaction(transaction)) {
					return prevPluginState;
				}

				if (transaction.docChanged && !transaction.doc.eq(oldState.doc)) {
					// For analytics purposes, inline comment annotations are not considered as edits to the document body
					// Transaction may contain other steps, but we know that they won't be user-generated (non synthetic) steps
					// Additionally, for analytics purposes we do not want to trigger on other participants' changes (i.e. remote changes)
					const isAnnotationStep = !!transaction.steps.find(
						(step: Step) => step instanceof AddMarkStep && step.mark?.type?.name === 'annotation',
					);

					return {
						collabInitialisedAt: prevPluginState.collabInitialisedAt,
						firstChangeAfterInitAt: Date.now(),
						firstContentBodyChangeAfterInitAt:
							isAnnotationStep || isRemote
								? prevPluginState.firstContentBodyChangeAfterInitAt
								: Date.now(),
					};
				}

				return prevPluginState;
			},
		},

		props: {
			attributes(editorState: EditorState) {
				const trackPluginState = trackNCSInitializationPluginKey.getState(editorState);

				return {
					['data-has-collab-initialised']: `${Boolean(trackPluginState?.collabInitialisedAt)}`,
				};
			},
		},
	});
};
