import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { isDirtyTransaction } from '@atlaskit/editor-common/collab';
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
import { ReplaceAroundStep, ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import { DecorationSet, Decoration } from '@atlaskit/editor-prosemirror/view';
import {
	convertPMNodesToSyncBlockNodes,
	rebaseTransaction,
} from '@atlaskit/editor-synced-block-provider';
import type { SyncBlockStoreManager, DeletionReason } from '@atlaskit/editor-synced-block-provider';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import {
	bodiedSyncBlockNodeView,
	bodiedSyncBlockNodeViewOld,
} from '../nodeviews/bodiedSyncedBlock';
import { SyncBlock as SyncBlockView } from '../nodeviews/syncedBlock';
import type { SyncedBlockPlugin, SyncedBlockPluginOptions } from '../syncedBlockPluginType';
import { FLAG_ID } from '../types';
import type {
	ActiveFlag,
	BodiedSyncBlockDeletionStatus,
	RetryCreationPosEntry,
	RetryCreationPosMap,
} from '../types';

import { handleBodiedSyncBlockCreation } from './utils/handle-bodied-sync-block-creation';
import { handleBodiedSyncBlockRemoval } from './utils/handle-bodied-sync-block-removal';
import type { TransactionRef } from './utils/handle-bodied-sync-block-removal';
import { shouldIgnoreDomEvent } from './utils/ignore-dom-event';
import { calculateDecorations } from './utils/selection-decorations';
import { hasEditInSyncBlock, trackSyncBlocks } from './utils/track-sync-blocks';
import {
	deferDispatch,
	wasExtensionInsertedInBodiedSyncBlock,
	sliceFullyContainsNode,
} from './utils/utils';

export const syncedBlockPluginKey: PluginKey = new PluginKey('syncedBlockPlugin');

type SyncedBlockPluginState = {
	activeFlag: ActiveFlag;
	bodiedSyncBlockDeletionStatus?: BodiedSyncBlockDeletionStatus;
	hasUnsavedBodiedSyncBlockChanges?: boolean;
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
		const { pos } = newRetryCreationPos;

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
	deferDispatch(() => {
		api?.core.actions.execute(({ tr }) =>
			tr.setMeta(syncedBlockPluginKey, {
				activeFlag: { id: FLAG_ID.SYNC_BLOCK_COPIED },
			}),
		);
	});
};

const showExtensionInSyncBlockWarningIfNeeded = (
	tr: Transaction,
	state: EditorState,
	api: ExtractInjectionAPI<SyncedBlockPlugin> | undefined,
	extensionFlagShown: Set<string>,
) => {
	if (
		!tr.docChanged ||
		tr.getMeta('isRemote') ||
		Boolean(tr.getMeta(pmHistoryPluginKey)) ||
		isOfflineMode(api?.connectivity?.sharedState.currentState()?.mode)
	) {
		return;
	}
	const resourceId = wasExtensionInsertedInBodiedSyncBlock(tr, state);
	// Only show the flag on the first instance per sync block (same as UNPUBLISHED_SYNC_BLOCK_PASTED)
	if (resourceId && !extensionFlagShown.has(resourceId)) {
		extensionFlagShown.add(resourceId);
		deferDispatch(() => {
			api?.core.actions.execute(({ tr }) =>
				tr.setMeta(syncedBlockPluginKey, {
					activeFlag: {
						id: editorExperiment('platform_synced_block_patch_6', true, { exposure: true })
							? FLAG_ID.EXTENSION_IN_SYNC_BLOCK
							: FLAG_ID.INLINE_EXTENSION_IN_SYNC_BLOCK,
					},
				}),
			);
		});
	}
};

const getDeleteReason = (tr: Transaction): DeletionReason => {
	const reason = tr.getMeta('deletionReason');
	if (!reason) {
		return 'source-block-deleted';
	}
	return reason as DeletionReason;
};

type FilterTransactionOnlineParams = {
	api: ExtractInjectionAPI<SyncedBlockPlugin> | undefined;
	bodiedSyncBlockAdded: ReturnType<typeof trackSyncBlocks>['added'];
	bodiedSyncBlockRemoved: ReturnType<typeof trackSyncBlocks>['removed'];
	confirmationTransactionRef: TransactionRef;
	extensionFlagShown: Set<string>;
	state: EditorState;
	syncBlockStore: SyncBlockStoreManager;
	tr: Transaction;
};

const filterTransactionOnline = ({
	tr,
	state,
	syncBlockStore,
	api,
	confirmationTransactionRef,
	bodiedSyncBlockRemoved,
	bodiedSyncBlockAdded,
	extensionFlagShown,
}: FilterTransactionOnlineParams): boolean => {
	const { removed: syncBlockRemoved, added: syncBlockAdded } = trackSyncBlocks(
		syncBlockStore.referenceManager.isReferenceBlock,
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
			actionSubject: ACTION_SUBJECT.DOCUMENT,
			actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK,
			attributes: {
				resourceId: syncBlock.attrs.resourceId,
				blockInstanceId: syncBlock.attrs.localId,
			},
			eventType: EVENT_TYPE.TRACK,
		});
	});

	if (bodiedSyncBlockRemoved.length > 0) {
		// eslint-disable-next-line no-param-reassign
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
		if (tr.getMeta(pmHistoryPluginKey)) {
			// We don't allow bodiedSyncBlock creation via redo, however, we need to return true here to let transaction through so history can be updated properly.
			// If we simply returns false, creation from redo is blocked as desired, but this results in editor showing redo as possible even though it's not.
			// After true is returned here and the node is created, we delete the node in the filterTransaction immediately, which cancels out the creation
			return true;
		}
		handleBodiedSyncBlockCreation(bodiedSyncBlockAdded, state, api);
		return true;
	}

	showExtensionInSyncBlockWarningIfNeeded(tr, state, api, extensionFlagShown);
	return true;
};

type FilterTransactionOfflineParams = {
	api: ExtractInjectionAPI<SyncedBlockPlugin> | undefined;
	bodiedSyncBlockAdded: ReturnType<typeof trackSyncBlocks>['added'];
	bodiedSyncBlockRemoved: ReturnType<typeof trackSyncBlocks>['removed'];
	isConfirmedSyncBlockDeletion: boolean;
	state: EditorState;
	syncBlockStore: SyncBlockStoreManager;
	tr: Transaction;
};

const filterTransactionOffline = ({
	tr,
	state,
	syncBlockStore,
	api,
	isConfirmedSyncBlockDeletion,
	bodiedSyncBlockRemoved,
	bodiedSyncBlockAdded,
}: FilterTransactionOfflineParams): boolean => {
	const { removed: syncBlockRemoved, added: syncBlockAdded } = trackSyncBlocks(
		syncBlockStore.referenceManager.isReferenceBlock,
		tr,
		state,
	);
	let errorFlag: FLAG_ID | false = false;

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
		deferDispatch(() => {
			api?.core.actions.execute(({ tr }) =>
				tr.setMeta(syncedBlockPluginKey, {
					activeFlag: { id: errorFlag },
				}),
			);
		});
		return false;
	}
	return true;
};

/**
 * Encapsulates mutable state that persists across transactions in the
 * synced block plugin. Replaces module-level closure variables so state
 * is explicitly scoped to a single plugin instance.
 */
class SyncedBlockPluginContext {
	readonly confirmationTransactionRef: TransactionRef = { current: undefined };
	private _isCopyEvent = false;
	readonly unpublishedFlagShown = new Set<string>();
	readonly extensionFlagShown = new Set<string>();

	get isCopyEvent(): boolean {
		return this._isCopyEvent;
	}

	markCopyEvent(): void {
		this._isCopyEvent = true;
	}

	consumeCopyEvent(): boolean {
		const was = this._isCopyEvent;
		this._isCopyEvent = false;
		return was;
	}
}

export const createPlugin = (
	options: SyncedBlockPluginOptions | undefined,
	pmPluginFactoryParams: PMPluginFactoryParams,
	syncBlockStore: SyncBlockStoreManager,
	api?: ExtractInjectionAPI<SyncedBlockPlugin>,
): SafePlugin<SyncedBlockPluginState> => {
	const { useLongPressSelection = false } = options || {};

	const ctx = new SyncedBlockPluginContext();
	const confirmationTransactionRef = ctx.confirmationTransactionRef;
	const unpublishedFlagShown = ctx.unpublishedFlagShown;
	const extensionFlagShown = ctx.extensionFlagShown;

	// Update plugin state post-flush to sync hasUnsavedBodiedSyncBlockChanges.
	// It prevents false "Changes may not be saved" warnings when publishing
	// Classic pages with sync blocks.
	syncBlockStore.sourceManager.registerFlushCompletionCallback(() => {
		deferDispatch(() => {
			api?.core.actions.execute(({ tr }) => tr);
		});
	});

	// Set up callback to detect unpublished sync blocks when they're fetched
	syncBlockStore.referenceManager.setOnUnpublishedSyncBlockDetected((resourceId: string) => {
		// Only show the flag once per sync block
		if (!unpublishedFlagShown.has(resourceId)) {
			unpublishedFlagShown.add(resourceId);
			deferDispatch(() => {
				api?.core.actions.execute(({ tr }) =>
					tr.setMeta(syncedBlockPluginKey, {
						activeFlag: { id: FLAG_ID.UNPUBLISHED_SYNC_BLOCK_PASTED },
					}),
				);
			});
		}
	});

	return new SafePlugin<SyncedBlockPluginState>({
		key: syncedBlockPluginKey,
		state: {
			init(_, instance: EditorState): SyncedBlockPluginState {
				const syncBlockNodes = instance.doc.children.filter(
					syncBlockStore.referenceManager.isReferenceBlock,
				);
				syncBlockStore.referenceManager.fetchSyncBlocksData(
					convertPMNodesToSyncBlockNodes(syncBlockNodes),
				);

				// Populate source sync block cache from initial document
				// When fg is ON, this replaces the constructor call in the nodeview
				if (fg('platform_synced_block_update_refactor')) {
					instance.doc.forEach((node) => {
						if (syncBlockStore.sourceManager.isSourceBlock(node)) {
							syncBlockStore.sourceManager.updateSyncBlockData(node, false);
						}
					});
				}

				return {
					selectionDecorationSet: calculateDecorations(
						instance.doc,
						instance.selection,
						instance.schema,
					),
					activeFlag: false,
					syncBlockStore: syncBlockStore,
					retryCreationPosMap: new Map(),
					hasUnsavedBodiedSyncBlockChanges: syncBlockStore.sourceManager.hasUnsavedChanges(),
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

				let newDecorationSet = tr.docChanged
					? selectionDecorationSet.map(tr.mapping, tr.doc) // only map if document changed
					: selectionDecorationSet;

				if (!tr.selection.eq(oldEditorState.selection)) {
					newDecorationSet = calculateDecorations(tr.doc, tr.selection, tr.doc.type.schema);
				} else if (tr.docChanged) {
					const existingDecorationsLength = selectionDecorationSet.find().length;
					const newDecorationsLength = newDecorationSet.find().length;

					// Edge case: When document nodes are replaced, the mapping can lose decorations
					// We rebuild decorations when the document changes but the selection hasn't.
					// We can do this check because we only expect 1 decoration for the selection
					if (existingDecorationsLength !== newDecorationsLength) {
						newDecorationSet = calculateDecorations(tr.doc, tr.selection, tr.doc.type.schema);
					}
				}

				const newPosEntry = meta?.retryCreationPos;
				const newRetryCreationPosMap = mapRetryCreationPosMap(
					retryCreationPosMap,
					newPosEntry,
					tr.mapping.map.bind(tr.mapping),
				);
				return {
					activeFlag: meta?.activeFlag ?? activeFlag,
					selectionDecorationSet: newDecorationSet,
					syncBlockStore: syncBlockStore,
					retryCreationPosMap: newRetryCreationPosMap,
					bodiedSyncBlockDeletionStatus:
						meta?.bodiedSyncBlockDeletionStatus ?? bodiedSyncBlockDeletionStatus,
					hasUnsavedBodiedSyncBlockChanges: syncBlockStore.sourceManager.hasUnsavedChanges(),
				};
			},
		},
		props: {
			nodeViews: {
				syncBlock: (node, view, getPos, _decorations) =>
					// To support SSR, pass `syncBlockStore` here
					// and do not use lazy loading.
					// We cannot start rendering and then load `syncBlockStore` asynchronously,
					// because obtaining it is asynchronous (sharedPluginState.currentState() is delayed).
					new SyncBlockView({
						api,
						options,
						node,
						view,
						getPos,
						portalProviderAPI: pmPluginFactoryParams.portalProviderAPI,
						eventDispatcher: pmPluginFactoryParams.eventDispatcher,
						syncBlockStore: syncBlockStore,
					}).init(),
				bodiedSyncBlock: editorExperiment('platform_synced_block_use_new_source_nodeview', true, {
					exposure: true,
				})
					? bodiedSyncBlockNodeView({
							pluginOptions: options,
							pmPluginFactoryParams,
							api,
							syncBlockStore,
					  })
					: bodiedSyncBlockNodeViewOld({
							pluginOptions: options,
							pmPluginFactoryParams,
							api,
							syncBlockStore,
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
				const isDragging =
					api?.userIntent?.sharedState.currentState()?.currentUserIntent === 'dragging';

				const offlineDecorations: Decoration[] = [];
				const viewModeDecorations: Decoration[] = [];
				const loadingDecorations: Decoration[] = [];
				const dragDecorations: Decoration[] = [];

				state.doc.descendants((node, pos) => {
					if (node.type.name === 'bodiedSyncBlock' && isOffline) {
						offlineDecorations.push(
							Decoration.node(pos, pos + node.nodeSize, {
								class: SyncBlockStateCssClassName.disabledClassName,
							}),
						);
					}

					if (syncBlockStore.isSyncBlock(node) && isViewMode) {
						viewModeDecorations.push(
							Decoration.node(pos, pos + node.nodeSize, {
								class: SyncBlockStateCssClassName.viewModeClassName,
							}),
						);
					}

					if (
						node.type.name === 'bodiedSyncBlock' &&
						syncBlockStore.sourceManager.isPendingCreation(node.attrs.resourceId)
					) {
						loadingDecorations.push(
							Decoration.node(pos, pos + node.nodeSize, {
								class: SyncBlockStateCssClassName.creationLoadingClassName,
							}),
						);
					}

					// Show sync block border while the user is dragging
					if (isDragging && syncBlockStore.isSyncBlock(node)) {
						dragDecorations.push(
							Decoration.node(pos, pos + node.nodeSize, {
								class: SyncBlockStateCssClassName.draggingClassName,
							}),
						);
					}
				});

				if (
					api?.focus?.sharedState?.currentState()?.hasFocus ||
					!editorExperiment('platform_synced_block_patch_6', true, { exposure: true })
				) {
					// Don't show decorations if the editor is not focused
					return selectionDecorationSet
						.add(doc, offlineDecorations)
						.add(doc, viewModeDecorations)
						.add(doc, loadingDecorations)
						.add(doc, dragDecorations);
				} else {
					return DecorationSet.empty
						.add(doc, offlineDecorations)
						.add(doc, viewModeDecorations)
						.add(doc, loadingDecorations)
						.add(doc, dragDecorations);
				}
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
					ctx.markCopyEvent();
					return false;
				},
			},
			transformCopied: (slice, { state }) => {
				const pluginState = syncedBlockPluginKey.getState(state);
				const syncBlockStore = pluginState?.syncBlockStore;
				const { schema } = state;
				const isCopy = ctx.consumeCopyEvent();

				if (!syncBlockStore || !isCopy) {
					return slice;
				}

				return mapSlice(slice, (node: Node) => {
					if (syncBlockStore.referenceManager.isReferenceBlock(node)) {
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
			const viewMode = api?.editorViewMode?.sharedState.currentState()?.mode;
			if (viewMode === 'view' && fg('platform_synced_block_patch_8')) {
				return true;
			}

			const isOffline = isOfflineMode(api?.connectivity?.sharedState.currentState()?.mode);
			const isConfirmedSyncBlockDeletion = Boolean(tr.getMeta('isConfirmedSyncBlockDeletion'));

			// Track newly added reference sync blocks before processing the transaction
			if (tr.docChanged && !tr.getMeta('isRemote')) {
				const { added } = trackSyncBlocks(
					syncBlockStore.referenceManager.isReferenceBlock,
					tr,
					state,
				);
				added.forEach((nodeInfo) => {
					if (nodeInfo.attrs?.resourceId) {
						syncBlockStore.referenceManager.markAsNewlyAdded(nodeInfo.attrs.resourceId);
					}
				});
			}

			if (fg('platform_synced_block_update_refactor')) {
				// if doc changed and it's a remote transaction, check if any synced block were added,
				// and if so, for source synced blocks, ensure we update the cache with them
				// and for reference synced blocks, ensure we fetch the data from the server
				if (tr.docChanged && tr.getMeta('isRemote')) {
					const { added } = trackSyncBlocks((node) => syncBlockStore.isSyncBlock(node), tr, state);
					const sourceSyncBlockNodes = added.filter(
						(nodeInfo) =>
							nodeInfo.node && syncBlockStore.sourceManager.isSourceBlock(nodeInfo.node),
					);
					const referenceSyncBlockNodes = added.filter(
						(nodeInfo) =>
							nodeInfo.node && syncBlockStore.referenceManager.isReferenceBlock(nodeInfo.node),
					);

					sourceSyncBlockNodes.forEach((nodeInfo) => {
						if (nodeInfo.attrs?.resourceId && nodeInfo.node) {
							syncBlockStore.sourceManager.updateSyncBlockData(
								nodeInfo.node,
								tr.getMeta('isRemote'),
							);
						}
					});

					const syncBlockNodes = referenceSyncBlockNodes
						.map((nodeInfo) => nodeInfo.node)
						.filter((node) => node !== undefined);
					syncBlockStore.referenceManager.fetchSyncBlocksData(
						convertPMNodesToSyncBlockNodes(syncBlockNodes),
					);
				}
			}

			if (
				!tr.docChanged ||
				Boolean(tr.getMeta('isRemote')) ||
				(!isOffline && isConfirmedSyncBlockDeletion)
			) {
				return true;
			}

			const { removed: bodiedSyncBlockRemoved, added: bodiedSyncBlockAdded } = trackSyncBlocks(
				syncBlockStore.sourceManager.isSourceBlock,
				tr,
				state,
			);

			return isOffline
				? filterTransactionOffline({
						tr,
						state,
						syncBlockStore,
						api,
						isConfirmedSyncBlockDeletion,
						bodiedSyncBlockRemoved,
						bodiedSyncBlockAdded,
				  })
				: filterTransactionOnline({
						tr,
						state,
						syncBlockStore,
						api,
						confirmationTransactionRef,
						bodiedSyncBlockRemoved,
						bodiedSyncBlockAdded,
						extensionFlagShown,
				  });
		},
		appendTransaction: (trs, oldState, newState) => {
			const viewMode = api?.editorViewMode?.sharedState.currentState()?.mode;
			if (viewMode === 'view' && fg('platform_synced_block_patch_8')) {
				return null;
			}

			// Update source sync block cache for user-initiated changes only
			// When fg is ON, cache updates are handled here instead of in the nodeview update()
			if (fg('platform_synced_block_update_refactor')) {
				const isUserChange = (tr: Transaction) =>
					tr.docChanged && !isDirtyTransaction(tr) && !tr.getMeta('isRemote');

				const hasSourceBlockEdit = trs.some(
					(tr) => isUserChange(tr) && hasEditInSyncBlock(tr, oldState),
				);

				if (hasSourceBlockEdit) {
					newState.doc.forEach((node) => {
						if (syncBlockStore.sourceManager.isSourceBlock(node)) {
							syncBlockStore.sourceManager.updateSyncBlockData(node, false);
						}
					});
				}
			}

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
				if (tr.getMeta(pmHistoryPluginKey)) {
					const { added } = trackSyncBlocks(
						syncBlockStore.sourceManager.isSourceBlock,
						tr,
						oldState,
					);

					if (added.length > 0) {
						// Delete bodiedSyncBlock if it's originated from history, i.e. redo creation
						// See filterTransaction above for more details
						const { tr } = newState;
						added.forEach((node) => {
							if (node.from !== undefined && node.to !== undefined) {
								tr.delete(node.from, node.to);
							}
						});

						return tr;
					}
				}
			}

			// Detect and remove duplicate bodiedSyncBlock resourceIds.
			// When a block template containing a source sync block is inserted into the
			// same document, it creates a duplicate with the same resourceId. We keep the
			// first occurrence and delete subsequent duplicates entirely (including their
			// contents), since a document must not contain two source sync blocks with the
			// same resourceId.
			if (
				trs.some((tr) => tr.docChanged && !tr.getMeta('isRemote')) &&
				fg('platform_synced_block_patch_8')
			) {
				// Quick check: only walk the full document when at least one
				// transaction inserted a source synced block. This avoids an
				// expensive descendants() traversal on every local edit.
				const hasInsertedSourceBlock = trs.some((tr) => {
					if (!tr.docChanged || tr.getMeta('isRemote')) {
						return false;
					}
					return tr.steps.some((step) => {
						if (
							!(step instanceof ReplaceStep || step instanceof ReplaceAroundStep) ||
							!('slice' in step)
						) {
							return false;
						}
						const { slice } = step as ReplaceStep | ReplaceAroundStep;
						let found = false;
						slice.content.descendants((node) => {
							if (syncBlockStore.sourceManager.isSourceBlock(node) && node.attrs.resourceId) {
								found = true;
							}
							return false;
						});
						return found;
					});
				});

				if (!hasInsertedSourceBlock) {
					return null;
				}

				const seenResourceIds = new Set<string>();
				const duplicates: Array<{ nodeSize: number; pos: number }> = [];

				newState.doc.descendants((node, pos) => {
					if (syncBlockStore.sourceManager.isSourceBlock(node) && node.attrs.resourceId) {
						if (seenResourceIds.has(node.attrs.resourceId)) {
							duplicates.push({ pos, nodeSize: node.nodeSize });
						} else {
							seenResourceIds.add(node.attrs.resourceId);
						}
						return false;
					}
				});

				if (duplicates.length > 0) {
					const { tr } = newState;

					// Delete in reverse document order so positions remain valid
					for (let i = duplicates.length - 1; i >= 0; i--) {
						const dup = duplicates[i];
						tr.delete(dup.pos, dup.pos + dup.nodeSize);
					}

					tr.setMeta('addToHistory', false);

					deferDispatch(() => {
						api?.core?.actions.execute(({ tr }) =>
							tr.setMeta(syncedBlockPluginKey, {
								activeFlag: { id: FLAG_ID.DUPLICATE_SOURCE_SYNC_BLOCK },
							}),
						);
					});

					return tr;
				}
			}

			return null;
		},
	});
};
