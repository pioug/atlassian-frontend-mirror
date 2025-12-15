import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { createSelectionClickHandler } from '@atlaskit/editor-common/selection';
import {
	BodiedSyncBlockSharedCssClassName,
	SyncBlockStateCssClassName,
} from '@atlaskit/editor-common/sync-block';
import type { ExtractInjectionAPI, PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import { mapSlice, pmHistoryPluginKey } from '@atlaskit/editor-common/utils';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { DecorationSet, Decoration } from '@atlaskit/editor-prosemirror/view';
import {
	convertPMNodesToSyncBlockNodes,
	rebaseTransaction,
	type SyncBlockStoreManager,
} from '@atlaskit/editor-synced-block-provider';

import { lazyBodiedSyncBlockView } from '../nodeviews/bodiedLazySyncedBlock';
import { lazySyncBlockView } from '../nodeviews/lazySyncedBlock';
import type { SyncedBlockPlugin, SyncedBlockPluginOptions } from '../syncedBlockPluginType';
import { FLAG_ID, type ActiveFlag, type BodiedSyncBlockDeletionStatus } from '../types';

import {
	handleBodiedSyncBlockRemoval,
	type ConfirmationTransactionRef,
} from './utils/handle-bodied-sync-block-removal';
import { shouldIgnoreDomEvent } from './utils/ignore-dom-event';
import { calculateDecorations } from './utils/selection-decorations';
import { hasEditInSyncBlock, trackSyncBlocks } from './utils/track-sync-blocks';

export const syncedBlockPluginKey = new PluginKey('syncedBlockPlugin');

type SyncedBlockPluginState = {
	activeFlag: ActiveFlag;
	bodiedSyncBlockDeletionStatus?: BodiedSyncBlockDeletionStatus;
	selectionDecorationSet: DecorationSet;
	syncBlockStore: SyncBlockStoreManager;
};

const showCopiedFlag = (api: ExtractInjectionAPI<SyncedBlockPlugin> | undefined) => {
	// Use setTimeout to dispatch transaction in next tick and avoid re-entrant dispatch
	setTimeout(() => {
		api?.core.actions.execute(({ tr }) => {
			return tr.setMeta(syncedBlockPluginKey, {
				activeFlag: { id: FLAG_ID.SYNC_BLOCK_COPIED },
			});
		});
	}, 0);
};

export const createPlugin = (
	options: SyncedBlockPluginOptions | undefined,
	pmPluginFactoryParams: PMPluginFactoryParams,
	syncBlockStore: SyncBlockStoreManager,
	api?: ExtractInjectionAPI<SyncedBlockPlugin>,
) => {
	const { useLongPressSelection = false } = options || {};
	const confirmationTransactionRef: ConfirmationTransactionRef = { current: undefined };

	return new SafePlugin<SyncedBlockPluginState>({
		key: syncedBlockPluginKey,
		state: {
			init(_, instance: EditorState): SyncedBlockPluginState {
				const syncBlockNodes = instance.doc.children.filter(
					(node) => node.type.name === 'syncBlock',
				);
				syncBlockStore.referenceManager.fetchSyncBlocksData(
					convertPMNodesToSyncBlockNodes(syncBlockNodes),
				);
				return {
					selectionDecorationSet: calculateDecorations(
						instance.doc,
						instance.selection,
						instance.schema,
					),
					activeFlag: false,
					syncBlockStore: syncBlockStore,
				};
			},
			apply: (tr, currentPluginState, oldEditorState) => {
				const meta = tr.getMeta(syncedBlockPluginKey);

				const { activeFlag, selectionDecorationSet, bodiedSyncBlockDeletionStatus } =
					currentPluginState;

				let newDecorationSet = selectionDecorationSet.map(tr.mapping, tr.doc);
				if (!tr.selection.eq(oldEditorState.selection)) {
					newDecorationSet = calculateDecorations(tr.doc, tr.selection, tr.doc.type.schema);
				}
				return {
					activeFlag: meta?.activeFlag ?? activeFlag,
					selectionDecorationSet: newDecorationSet,
					syncBlockStore: syncBlockStore,
					bodiedSyncBlockDeletionStatus:
						meta?.bodiedSyncBlockDeletionStatus ?? bodiedSyncBlockDeletionStatus,
				};
			},
		},
		props: {
			nodeViews: {
				syncBlock: lazySyncBlockView({
					options,
					pmPluginFactoryParams,
					api,
				}),
				bodiedSyncBlock: lazyBodiedSyncBlockView({
					pluginOptions: options,
					pmPluginFactoryParams,
					api,
				}),
			},
			decorations: (state) => {
				const selectionDecorationSet: DecorationSet =
					syncedBlockPluginKey.getState(state)?.selectionDecorationSet ?? DecorationSet.empty;
				const { doc } = state;

				const isOffline = api?.connectivity?.sharedState.currentState()?.mode === 'offline';
				const isViewMode = api?.editorViewMode?.sharedState.currentState()?.mode === 'view';

				const offlineDecorations: Decoration[] = [];
				const viewModeDecorations: Decoration[] = [];

				state.doc.descendants((node, pos) => {
					if (node.type.name === 'bodiedSyncBlock' && isOffline) {
						offlineDecorations.push(
							Decoration.node(pos, pos + node.nodeSize, {
								class: SyncBlockStateCssClassName.disabledClassName,
							}),
						);
					}

					if (
						(node.type.name === 'bodiedSyncBlock' || node.type.name === 'syncBlock') &&
						isViewMode
					) {
						viewModeDecorations.push(
							Decoration.node(pos, pos + node.nodeSize, {
								class: SyncBlockStateCssClassName.viewModeClassName,
							}),
						);
					}
				});

				return selectionDecorationSet.add(doc, offlineDecorations).add(doc, viewModeDecorations);
			},
			handleClickOn: createSelectionClickHandler(
				['bodiedSyncBlock'],
				(target) => !!target.closest(`.${BodiedSyncBlockSharedCssClassName.prefix}`),
				{ useLongPressSelection },
			),
			handleDOMEvents: {
				mouseover(view, event) {
					return shouldIgnoreDomEvent(view, event, api);
				},
				mousedown(view, event) {
					return shouldIgnoreDomEvent(view, event, api);
				},
			},
			transformCopied: (slice, { state }) => {
				const pluginState = syncedBlockPluginKey.getState(state);
				const syncBlockStore = pluginState?.syncBlockStore;
				const { schema } = state;

				if (!syncBlockStore) {
					return slice;
				}

				return mapSlice(slice, (node: Node) => {
					if (node.type.name === 'syncBlock') {
						showCopiedFlag(api);
						return node;
					}
					if (node.type.name === 'bodiedSyncBlock' && node.attrs.resourceId) {
						showCopiedFlag(api);

						const newResourceId = syncBlockStore.referenceManager.generateResourceIdForReference(
							node.attrs.resourceId,
						);
						// Convert bodiedSyncBlock to syncBlock
						// The paste transformation will regenrate the localId
						const newAttrs = { ...node.attrs, resourceId: newResourceId };

						const newMarks = schema.nodes.syncBlock.markSet
							? node.marks.filter((mark) => schema.nodes.syncBlock.markSet?.includes(mark.type))
							: node.marks;

						return schema.nodes.syncBlock.create(newAttrs, null, newMarks);
					}
					return node;
				});
			},
		},
		filterTransaction: (tr, state) => {
			const isOffline = api?.connectivity?.sharedState.currentState()?.mode === 'offline';
			const isConfirmedSyncBlockDeletion = Boolean(tr.getMeta('isConfirmedSyncBlockDeletion'));
			// Ignore transactions that don't change the document
			// or are from remote (collab) or already confirmed sync block deletion
			// We only care about local changes that change the document
			// and are not yet confirmed for sync block deletion
			if (
				!tr.docChanged ||
				(!syncBlockStore?.sourceManager.requireConfirmationBeforeDelete() &&
					!syncBlockStore.sourceManager.hasPendingCreation()) ||
				Boolean(tr.getMeta('isRemote')) ||
				Boolean(tr.getMeta('isCommitSyncBlockCreation')) ||
				(!isOffline && isConfirmedSyncBlockDeletion)
			) {
				return true;
			}

			const { removed: bodiedSyncBlockRemoved, added: bodiedSyncBlockAdded } = trackSyncBlocks(
				syncBlockStore.sourceManager.isSourceBlock,
				tr,
				state,
			);

			if (!isOffline) {
				if (bodiedSyncBlockRemoved.length > 0) {
					confirmationTransactionRef.current = tr;
					return handleBodiedSyncBlockRemoval(
						tr,
						bodiedSyncBlockRemoved,
						syncBlockStore,
						api,
						confirmationTransactionRef,
					);
				}

				if (bodiedSyncBlockAdded.length > 0) {
					if (Boolean(tr.getMeta(pmHistoryPluginKey))) {
						// We don't allow bodiedSyncBlock creation via redo, however, we need to return true here to let transaction through so history can be updated properly.
						// If we simply returns false, creation from redo is blocked as desired, but this results in editor showing redo as possible even though it's not.
						// After true is returned here and the node is created, we delete the node in the filterTransaction immediately, which cancels out the creation
						return true;
					}

					// If there is bodiedSyncBlock node addition and it's waiting for the result of saving the node to backend (syncBlockStore.hasPendingCreation()),
					// we need to intercept the transaction and save it in insert callback so that we only insert it to the document when backend call if backend call is successful
					// The callback will be evoked by in SourceSyncBlockStoreManager.commitPendingCreation
					syncBlockStore.sourceManager.registerCreationCallback(() => {
						api?.core?.actions.execute(() => {
							return tr.setMeta('isCommitSyncBlockCreation', true);
						});
						api?.core.actions.focus();
					});

					return false;
				}
			} else {
				const { removed: syncBlockRemoved, added: syncBlockAdded } = trackSyncBlocks(
					(node) => node.type.name === 'syncBlock',
					tr,
					state,
				);
				let errorFlag: FLAG_ID | false = false;

				// Disable (bodied)syncBlock node deletion/creation/edition in offline mode and trigger an error flag instead
				if (
					isConfirmedSyncBlockDeletion ||
					bodiedSyncBlockRemoved.length > 0 ||
					syncBlockRemoved.length > 0
				) {
					errorFlag = FLAG_ID.CANNOT_DELETE_WHEN_OFFLINE;
				} else if (bodiedSyncBlockAdded.length > 0 || syncBlockAdded.length > 0) {
					errorFlag = FLAG_ID.CANNOT_CREATE_WHEN_OFFLINE;
				} else if (hasEditInSyncBlock(tr, state)) {
					errorFlag = FLAG_ID.CANNOT_EDIT_WHEN_OFFLINE;
				}

				if (errorFlag) {
					// Use setTimeout to dispatch transaction in next tick and avoid re-entrant dispatch
					setTimeout(() => {
						api?.core.actions.execute(({ tr }) => {
							return tr.setMeta(syncedBlockPluginKey, {
								activeFlag: { id: errorFlag },
							});
						});
					}, 0);
					return false;
				}
			}

			return true;
		},
		appendTransaction: (trs, oldState, newState) => {
			trs
				.filter((tr) => tr.docChanged)
				.forEach((tr) => {
					if (confirmationTransactionRef.current) {
						confirmationTransactionRef.current = rebaseTransaction(
							confirmationTransactionRef.current,
							tr,
							newState,
						);
					}
				});

			for (const tr of trs) {
				if (!tr.getMeta(pmHistoryPluginKey)) {
					continue;
				}
				const { added } = trackSyncBlocks(syncBlockStore.sourceManager.isSourceBlock, tr, oldState);

				if (added.length > 0) {
					// Delete bodiedSyncBlock if it's originated from history, i.e. redo creation
					// See filterTransaction above for more details
					const tr = newState.tr;
					added.forEach((node) => {
						if (node.from !== undefined && node.to !== undefined) {
							tr.delete(node.from, node.to);
						}
					});

					return tr;
				}
			}

			return null;
		},
	});
};
