import { bind } from 'bind-event-listener';

import { ACTION_SUBJECT, ACTION_SUBJECT_ID } from '@atlaskit/editor-common/analytics';
import {
	Experience,
	ExperienceCheckDomMutation,
	ExperienceCheckTimeout,
} from '@atlaskit/editor-common/experiences';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { type ExperienceOptions, type ProviderExperienceOptions, EXPERIENCE_ABORT_REASON } from '../../types'
import { getRemovedResourceIds, getTarget, wasSyncBlockDeletedOrAddedByHistory } from '../utils/experience-tracking-utils';

const pluginKey = new PluginKey('deleteReferenceSyncBlockExperience');

const START_METHOD = {
	ELEMENT_TOOLBAR: 'element-toolbar',
	DELETE: 'delete',
	TYPED_OVER: 'typed-over',
	CUT: 'cut',
	UNDO: 'undo',
	REDO: 'redo'
};

/**
 * This experience tracks when a reference sync block is deleted.
 *
 * Start: When user deletes ref sync block from toolbar, presses delete when cursor is in front of ref sync block,
 * presses any key with a ref sync block selected, cuts with a ref sync block selected, triggers undo/redo that deletes a ref sync block
 * Success: When the sync block is removed from the DOM within 2000ms of start
 * Failure: When 2000ms passes without the reference sync block being removed from the DOM
 */
export const getDeleteReferenceExperiencePlugin = ({
	refs,
	dispatchAnalyticsEvent,
	syncBlockStore,
}: ProviderExperienceOptions) => {
	const experience = getDeleteReferenceExperience({ refs, dispatchAnalyticsEvent });
	syncBlockStore.sourceManager.setDeleteExperience(experience);

	const unbindClickListener = bind(document, {
		type: 'click',
		listener: (event: MouseEvent) => {
			const target = event.target as Element | null;
			if (!target) {
				return;
			}

			const button = target.closest('button[data-testid]');
			if (!button || !(button instanceof HTMLButtonElement)) {
				return;
			}

			const testId = button.dataset.testid;
			if (isReferenceSyncedBlockDeleteButtonId(testId)) {
				experience.start({ method: START_METHOD.ELEMENT_TOOLBAR})
			}
		}
	});

	return new SafePlugin({
		key: pluginKey,
		props: {
			handleDOMEvents: {
				cut: (view: EditorView) => {
					const { state } = view;

					if (hasSyncBlockInSelection(state.selection)) {
						experience.start({ method: START_METHOD.CUT });
					}

					return false;
				},
				keydown: (view: EditorView, event: KeyboardEvent) => {
					const { state } = view;

					const hasSelection = hasSyncBlockInSelection(state.selection);
					const hasAdjacent = hasSyncBlockBeforeCursor(state.selection);

					if (hasSelection) {
						experience.start({ method: START_METHOD.TYPED_OVER });
					}

					if (isDeleteKey(event.key) && hasAdjacent) {
						experience.start({ method: START_METHOD.DELETE });
					}

					return false;
				},
			},
		},
		appendTransaction: (transactions, oldState, newState) => {
			transactions.forEach((tr) => {
				const { hasDeletedSyncBlock, isUndo } = wasSyncBlockDeletedOrAddedByHistory(tr, oldState, newState);
				if (hasDeletedSyncBlock) {
					experience.start({
						method: isUndo ? START_METHOD.UNDO : START_METHOD.REDO
					});
				}
			});

			return null;
		},
		view: () => {
			return {
				destroy: () => {
					experience.abort({ reason: EXPERIENCE_ABORT_REASON.EDITOR_DESTROYED });
					unbindClickListener();
				},
			};
		},
	})
}

export const getDeleteReferenceExperience = ({ refs, dispatchAnalyticsEvent }: ExperienceOptions) => {
	return new Experience(ACTION_SUBJECT.SYNCED_BLOCK, {
		actionSubjectId: ACTION_SUBJECT_ID.REFERENCE_SYNCED_BLOCK_DELETE,
		dispatchAnalyticsEvent,
		checks: [
			new ExperienceCheckTimeout({ durationMs: 2000 }),
			new ExperienceCheckDomMutation({
				onDomMutation: ({ mutations }) => {
					const deletedResourceIds = getRemovedResourceIds(mutations, '[data-prosemirror-node-name="syncBlock"]');
					if (deletedResourceIds.length > 0) {
						return {
							status: 'success',
							metadata: { deletedResourceIds }
						};
					}

					return undefined;
				},
				observeConfig: () => {
					return {
						target: getTarget(refs.containerElement),
						options: {
							childList: true,
						},
					};
				},
			}),
		],
	});
};

const isReferenceSyncedBlockDeleteButtonId = (testId?: string) =>
	testId === 'reference-synced-block-delete-button';

const isDeleteKey = (key: string) => {
	return key === 'Delete' || key === 'Backspace';
};

const hasSyncBlockInSelection = (selection: Selection): boolean => {
	const { syncBlock } = selection.$from.doc.type.schema.nodes;
	let found = false;

	selection.$from.doc.nodesBetween(selection.from, selection.to, (node: PMNode) => {
		if (node.type === syncBlock) {
			found = true;
			return false;
		}
		// sync block nodes can only be found at the top level
		return false;
	});

	return found;
};

const hasSyncBlockBeforeCursor = (selection: Selection): boolean => {
	if (!selection.empty) {
		return false;
	}

	const { syncBlock } = selection.$from.doc.type.schema.nodes;
	const { nodeBefore } = selection.$from;

	return nodeBefore?.type === syncBlock;
};
