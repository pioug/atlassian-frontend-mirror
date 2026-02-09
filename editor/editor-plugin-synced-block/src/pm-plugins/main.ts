import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { createSelectionClickHandler } from '@atlaskit/editor-common/selection';
import {
	BodiedSyncBlockSharedCssClassName,
	SyncBlockStateCssClassName,
} from '@atlaskit/editor-common/sync-block';
import type { ExtractInjectionAPI, PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import { mapSlice, pmHistoryPluginKey } from '@atlaskit/editor-common/utils';
import { isOfflineMode } from '@atlaskit/editor-plugin-connectivity';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { DecorationSet, Decoration } from '@atlaskit/editor-prosemirror/view';
import {
	convertPMNodesToSyncBlockNodes,
	rebaseTransaction,
	type DeletionReason,
	type SyncBlockStoreManager,
} from '@atlaskit/editor-synced-block-provider';
import { fg } from '@atlaskit/platform-feature-flags';

import { lazyBodiedSyncBlockView } from '../nodeviews/bodiedLazySyncedBlock';
import { SyncBlock as SyncBlockView } from '../nodeviews/syncedBlock';
import type { SyncedBlockPlugin, SyncedBlockPluginOptions } from '../syncedBlockPluginType';
import {
	FLAG_ID,
	type ActiveFlag,
	type BodiedSyncBlockDeletionStatus,
	type RetryCreationPosEntry,
	type RetryCreationPosMap,
} from '../types';

import { handleBodiedSyncBlockCreation } from './utils/handle-bodied-sync-block-creation';
import {
	handleBodiedSyncBlockRemoval,
	type TransactionRef,
} from './utils/handle-bodied-sync-block-removal';
import { shouldIgnoreDomEvent } from './utils/ignore-dom-event';
import { calculateDecorations } from './utils/selection-decorations';
import { hasEditInSyncBlock, trackSyncBlocks } from './utils/track-sync-blocks';
import { sliceFullyContainsNode } from './utils/utils';

export const syncedBlockPluginKey = new PluginKey('syncedBlockPlugin');

type SyncedBlockPluginState = {
	activeFlag: ActiveFlag;
	bodiedSyncBlockDeletionStatus?: BodiedSyncBlockDeletionStatus;
	retryCreationPosMap: RetryCreationPosMap;
	selectionDecorationSet: DecorationSet;
	syncBlockStore: SyncBlockStoreManager;
};

const mapRetryCreationPosMap = (
	oldMap: RetryCreationPosMap,
	newRetryCreationPos: RetryCreationPosEntry | undefined,
	mapPos: (pos: number) => number,
): RetryCreationPosMap => {
	const resourceId = newRetryCreationPos?.resourceId;
	const newMap = new Map(oldMap);
	if (resourceId) {
		const pos = newRetryCreationPos.pos;

		if (!pos) {
			newMap.delete(resourceId);
		} else {
			newMap.set(resourceId, pos);
		}
	}
	if (newMap.size === 0) {
		return newMap;
	}

	for (const [id, pos] of newMap.entries()) {
		newMap.set(id, {
			from: mapPos(pos.from),
			to: mapPos(pos.to),
		});
	}

	return newMap;
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

const getDeleteReason = (tr: Transaction): DeletionReason => {
	const reason = tr.getMeta('deletionReason');
	if (!reason) {
		return 'source-block-deleted';
	}
	return reason as DeletionReason;
};

export const createPlugin = (
	options: SyncedBlockPluginOptions | undefined,
	pmPluginFactoryParams: PMPluginFactoryParams,
	syncBlockStore: SyncBlockStoreManager,
	api?: ExtractInjectionAPI<SyncedBlockPlugin>,
) => {
	const { useLongPressSelection = false } = options || {};
	const confirmationTransactionRef: TransactionRef = { current: undefined };
	// Track if a copy event occurred to distinguish copy from drag and drop
	let isCopyEvent: boolean = false;
	// Track which sync blocks have already triggered the unpublished flag
	const unpublishedFlagShown = new Set<string>();

	// Set up callback to detect unpublished sync blocks when they're fetched
	syncBlockStore.referenceManager.setOnUnpublishedSyncBlockDetected((resourceId: string) => {
		// Only show the flag once per sync block
		if (!unpublishedFlagShown.has(resourceId)) {
			unpublishedFlagShown.add(resourceId);
			// Use setTimeout to dispatch transaction in next tick and avoid re-entrant dispatch
			setTimeout(() => {
				api?.core.actions.execute(({ tr }) => {
					return tr.setMeta(syncedBlockPluginKey, {
						activeFlag: { id: FLAG_ID.UNPUBLISHED_SYNC_BLOCK_PASTED },
					});
				});
			}, 0);
		}
	});

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
					retryCreationPosMap: new Map(),
				};
			},
			apply: (tr, currentPluginState, oldEditorState) => {
				const meta = tr.getMeta(syncedBlockPluginKey);

				const {
					activeFlag,
					selectionDecorationSet,
					bodiedSyncBlockDeletionStatus,
					retryCreationPosMap,
				} = currentPluginState;

				let newDecorationSet = selectionDecorationSet.map(tr.mapping, tr.doc);
				if (!tr.selection.eq(oldEditorState.selection)) {
					newDecorationSet = calculateDecorations(tr.doc, tr.selection, tr.doc.type.schema);
				}

				let newRetryCreationPosMap = retryCreationPosMap;
				if (fg('platform_synced_block_patch_1')) {
					const newPosEntry = meta?.retryCreationPos;

					newRetryCreationPosMap = mapRetryCreationPosMap(
						retryCreationPosMap,
						newPosEntry,
						tr.mapping.map.bind(tr.mapping),
					);
				}
				return {
					activeFlag: meta?.activeFlag ?? activeFlag,
					selectionDecorationSet: newDecorationSet,
					syncBlockStore: syncBlockStore,
					retryCreationPosMap: newRetryCreationPosMap,
					bodiedSyncBlockDeletionStatus:
						meta?.bodiedSyncBlockDeletionStatus ?? bodiedSyncBlockDeletionStatus,
				};
			},
		},
		props: {
			nodeViews: {
				syncBlock: (node, view, getPos, _decorations) => {
					// To support SSR, pass `syncBlockStore` here
					// and do not use lazy loading.
					// We cannot start rendering and then load `syncBlockStore` asynchronously,
					// because obtaining it is asynchronous (sharedPluginState.currentState() is delayed).
					return new SyncBlockView({
						api,
						options,
						node,
						view,
						getPos,
						portalProviderAPI: pmPluginFactoryParams.portalProviderAPI,
						eventDispatcher: pmPluginFactoryParams.eventDispatcher,
						syncBlockStore: syncBlockStore,
					}).init();
				},
				bodiedSyncBlock: lazyBodiedSyncBlockView({
					pluginOptions: options,
					pmPluginFactoryParams,
					api,
				}),
			},
			decorations: (state) => {
				const currentPluginState = syncedBlockPluginKey.getState(state);
				const selectionDecorationSet: DecorationSet =
					currentPluginState?.selectionDecorationSet ?? DecorationSet.empty;
				const syncBlockStore: SyncBlockStoreManager = currentPluginState?.syncBlockStore;
				const { doc } = state;

				const isOffline = isOfflineMode(api?.connectivity?.sharedState.currentState()?.mode);
				const isViewMode = api?.editorViewMode?.sharedState.currentState()?.mode === 'view';

				const offlineDecorations: Decoration[] = [];
				const viewModeDecorations: Decoration[] = [];
				const loadingDecorations: Decoration[] = [];

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

					if (
						node.type.name === 'bodiedSyncBlock' &&
						syncBlockStore.sourceManager.isPendingCreation(node.attrs.resourceId) &&
						fg('platform_synced_block_patch_1')
					) {
						loadingDecorations.push(
							Decoration.node(pos, pos + node.nodeSize, {
								class: SyncBlockStateCssClassName.creationLoadingClassName,
							}),
						);
					}
				});

				return selectionDecorationSet
					.add(doc, offlineDecorations)
					.add(doc, viewModeDecorations)
					.add(doc, loadingDecorations);
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
				copy: () => {
					isCopyEvent = true;
					return false;
				},
			},
			transformCopied: (slice, { state }) => {
				const pluginState = syncedBlockPluginKey.getState(state);
				const syncBlockStore = pluginState?.syncBlockStore;
				const { schema } = state;
				const isCopy = isCopyEvent;
				isCopyEvent = false;

				if (!syncBlockStore || !isCopy) {
					return slice;
				}

				return mapSlice(slice, (node: Node) => {
					if (node.type.name === 'syncBlock') {
						showCopiedFlag(api);

						return node;
					}
					if (node.type.name === 'bodiedSyncBlock' && node.attrs.resourceId) {
						// if we only selected part of the bodied sync block content,
						// remove the sync block node and only keep the content
						if (!sliceFullyContainsNode(slice, node)) {
							return node.content;
						}

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
			const isOffline = isOfflineMode(api?.connectivity?.sharedState.currentState()?.mode);
			const isConfirmedSyncBlockDeletion = Boolean(tr.getMeta('isConfirmedSyncBlockDeletion'));

			const hasNoPendingRequest = fg('platform_synced_block_patch_1')
				? false
				: // requireConfirmationBeforeDelete is always true, so this evaluates to false and hence redundant
					!syncBlockStore?.sourceManager.requireConfirmationBeforeDelete() &&
					!syncBlockStore.sourceManager.hasPendingCreation();

			const isCommitsCreation = fg('platform_synced_block_patch_1')
				? false
				: // For patch 1, we don't intercept the insert transaction, hence it's redundant
					Boolean(tr.getMeta('isCommitSyncBlockCreation'));

			// Track newly added reference sync blocks before processing the transaction
			if (tr.docChanged && !tr.getMeta('isRemote')) {
				const { added } = trackSyncBlocks((node) => node.type.name === 'syncBlock', tr, state);
				// Mark newly added sync blocks so we can detect unpublished status when data is fetched
				added.forEach((nodeInfo) => {
					if (nodeInfo.attrs?.resourceId) {
						syncBlockStore.referenceManager.markAsNewlyAdded(nodeInfo.attrs.resourceId);
					}
				});
			}

			// Ignore transactions that don't change the document
			// or are from remote (collab) or already confirmed sync block deletion
			// We only care about local changes that change the document
			// and are not yet confirmed for sync block deletion
			if (
				!tr.docChanged ||
				hasNoPendingRequest ||
				Boolean(tr.getMeta('isRemote')) ||
				isCommitsCreation ||
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
				const { removed: syncBlockRemoved, added: syncBlockAdded } = trackSyncBlocks(
					(node) => node.type.name === 'syncBlock',
					tr,
					state,
				);

				syncBlockRemoved.forEach((syncBlock) => {
					api?.analytics?.actions?.fireAnalyticsEvent({
						action: ACTION.DELETED,
						actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
						actionSubjectId: ACTION_SUBJECT_ID.REFERENCE_SYNCED_BLOCK_DELETE,
						attributes: {
							resourceId: syncBlock.attrs.resourceId,
							blockInstanceId: syncBlock.attrs.localId,
						},
						eventType: EVENT_TYPE.OPERATIONAL,
					});
				});

				syncBlockAdded.forEach((syncBlock) => {
					api?.analytics?.actions?.fireAnalyticsEvent({
						action: ACTION.INSERTED,
						actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
						actionSubjectId: ACTION_SUBJECT_ID.REFERENCE_SYNCED_BLOCK_CREATE,
						attributes: {
							resourceId: syncBlock.attrs.resourceId,
							blockInstanceId: syncBlock.attrs.localId,
						},
						eventType: EVENT_TYPE.OPERATIONAL,
					});
				});

				if (bodiedSyncBlockRemoved.length > 0) {
					confirmationTransactionRef.current = tr;
					return handleBodiedSyncBlockRemoval(
						bodiedSyncBlockRemoved,
						syncBlockStore,
						api,
						confirmationTransactionRef,
						getDeleteReason(tr),
					);
				}

				if (bodiedSyncBlockAdded.length > 0) {
					if (Boolean(tr.getMeta(pmHistoryPluginKey))) {
						// We don't allow bodiedSyncBlock creation via redo, however, we need to return true here to let transaction through so history can be updated properly.
						// If we simply returns false, creation from redo is blocked as desired, but this results in editor showing redo as possible even though it's not.
						// After true is returned here and the node is created, we delete the node in the filterTransaction immediately, which cancels out the creation
						return true;
					}
					if (fg('platform_synced_block_patch_1')) {
						handleBodiedSyncBlockCreation(bodiedSyncBlockAdded, state, api);

						return true;
					} else {
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
