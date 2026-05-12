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
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
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
import { hasSyncedBlocks } from './utils/has-synced-blocks';
import { shouldIgnoreDomEvent } from './utils/ignore-dom-event';
import { calculateDecorations } from './utils/selection-decorations';
import { hasEditInSyncBlock, trackSyncBlocks } from './utils/track-sync-blocks';
import { transactionInsertsSyncedBlock } from './utils/transaction-inserts-synced-block';
import {
	deferDispatch,
	wasExtensionInsertedInBodiedSyncBlock,
	sliceFullyContainsNode,
} from './utils/utils';

export const syncedBlockPluginKey: PluginKey = new PluginKey('syncedBlockPlugin');

type SyncedBlockPluginState = {
	activeFlag: ActiveFlag;
	bodiedSyncBlockDeletionStatus?: BodiedSyncBlockDeletionStatus;
	/**
	 * When `editor_synced_block_perf` is ON, this flag tracks whether the
	 * document currently contains any synced block (source or reference). When
	 * `false`, downstream work in `appendTransaction`, `decorations`, and the
	 * `contentComponent` short-circuits to avoid the per-transition feature tax
	 * on the ~99.97% of pages that have no synced blocks (see EDITOR-6586).
	 *
	 * When the gate is OFF this is always `true` so existing behavior is
	 * preserved.
	 */
	hasSyncedBlocks: boolean;
	hasUnsavedBodiedSyncBlockChanges?: boolean;
	/**
	 * Cached previous values for shared-state signals. Used inside `apply()` to
	 * detect when a status change requires a full rebuild of `statusDecorationSet`
	 * instead of a cheap `map()` call. Only meaningful when
	 * `editor_synced_block_perf` is ON.
	 */
	prevIsDragging: boolean;
	prevIsOffline: boolean;
	prevIsViewMode: boolean;
	retryCreationPosMap: RetryCreationPosMap;
	selectionDecorationSet: DecorationSet;
	/**
	 * Cached decoration set for sync-block status decorations (offline overlay,
	 * view-mode class, creation-loading spinner, drag border). When the perf
	 * gate is ON this is computed in `apply()` and mapped through edits so the
	 * `decorations` prop becomes an O(1) lookup instead of a full
	 * `doc.descendants()` walk every transaction (see EDITOR-6930).
	 */
	statusDecorationSet: DecorationSet;
	syncBlockStore: SyncBlockStoreManager;
};

const mapRetryCreationPosMap = (
	oldMap: RetryCreationPosMap,
	newRetryCreationPos: RetryCreationPosEntry | undefined,
	mapPos: (pos: number) => number,
): RetryCreationPosMap => {
	const resourceId = newRetryCreationPos?.resourceId;

	// Fast path: no new entry and nothing to remap — return the same reference.
	// This is critical for PR-E (EDITOR-6929) which relies on reference equality
	// to short-circuit SharedStateAPI deep-equality checks.
	if (
		expValEquals('editor_synced_block_perf', 'isEnabled', true) &&
		!resourceId &&
		oldMap.size === 0
	) {
		return oldMap;
	}

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
						id: FLAG_ID.EXTENSION_IN_SYNC_BLOCK,
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
 * Build the status decoration set for sync-block nodes. This performs a full
 * `doc.descendants()` walk so it must only be called when a status signal
 * actually changes (offline, view-mode, dragging, pending-creation). Between
 * status changes the caller should use `decorationSet.map(tr.mapping, tr.doc)`
 * instead (see EDITOR-6930).
 */
const buildStatusDecorations = (
	doc: Node,
	syncBlockStore: SyncBlockStoreManager,
	isOffline: boolean,
	isViewMode: boolean,
	isDragging: boolean,
): DecorationSet => {
	// Fast path: when all status flags are off and no creations are in flight,
	// no node can produce a decoration — skip the full doc traversal.
	if (
		!isOffline &&
		!isViewMode &&
		!isDragging &&
		!syncBlockStore.sourceManager.hasPendingCreations()
	) {
		return DecorationSet.empty;
	}

	const offlineDecorations: Decoration[] = [];
	const viewModeDecorations: Decoration[] = [];
	const loadingDecorations: Decoration[] = [];
	const dragDecorations: Decoration[] = [];

	doc.descendants((node, pos) => {
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

		if (isDragging && syncBlockStore.isSyncBlock(node)) {
			dragDecorations.push(
				Decoration.node(pos, pos + node.nodeSize, {
					class: SyncBlockStateCssClassName.draggingClassName,
				}),
			);
		}

		// only traverse the top-level node of the document, as syncBlock and bodiedSyncBlock are top-level nodes
		return false;
	});

	return DecorationSet.create(doc, [
		...offlineDecorations,
		...viewModeDecorations,
		...loadingDecorations,
		...dragDecorations,
	]);
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
				// When `editor_synced_block_perf` is ON and the document has no
				// synced blocks, we skip the eager fetch + cache walks. They will be
				// re-run lazily by `apply` the first time a synced block enters the
				// document (paste, collab insert, or programmatic insert).
				const docHasSyncedBlocks = expValEquals('editor_synced_block_perf', 'isEnabled', true)
					? hasSyncedBlocks(instance.doc)
					: true;

				if (docHasSyncedBlocks) {
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

						// Fetch statuses from the backend so we can identify unpublished blocks on cancel
						if (fg('platform_synced_block_patch_10')) {
							syncBlockStore.sourceManager.fetchAndCacheStatuses();
						}
					}
				}

				// Read initial shared-state signals for status decorations
				const initIsOffline = isOfflineMode(api?.connectivity?.sharedState.currentState()?.mode);
				const initIsViewMode = api?.editorViewMode?.sharedState.currentState()?.mode === 'view';
				const initIsDragging =
					api?.userIntent?.sharedState.currentState()?.currentUserIntent === 'dragging';

				// Build initial status decoration set (EDITOR-6930).
				// When the perf gate is ON and the doc has synced blocks we do a
				// single traversal here; afterwards `apply()` will map or rebuild
				// only when a status signal changes.
				const initStatusDecorationSet =
					docHasSyncedBlocks && expValEquals('editor_synced_block_perf', 'isEnabled', true)
						? buildStatusDecorations(
								instance.doc,
								syncBlockStore,
								initIsOffline,
								initIsViewMode,
								initIsDragging,
							)
						: DecorationSet.empty;

				return {
					selectionDecorationSet: calculateDecorations(
						instance.doc,
						instance.selection,
						instance.schema,
					),
					activeFlag: false,
					syncBlockStore: syncBlockStore,
					retryCreationPosMap: new Map(),
					hasSyncedBlocks: docHasSyncedBlocks,
					hasUnsavedBodiedSyncBlockChanges: syncBlockStore.sourceManager.hasUnsavedChanges(),
					statusDecorationSet: initStatusDecorationSet,
					prevIsOffline: initIsOffline,
					prevIsViewMode: initIsViewMode,
					prevIsDragging: initIsDragging,
				};
			},
			apply: (tr, currentPluginState, oldEditorState) => {
				const meta = tr.getMeta(syncedBlockPluginKey);
				const isPerfExperimentOn = expValEquals('editor_synced_block_perf', 'isEnabled', true);

				const {
					activeFlag,
					selectionDecorationSet,
					bodiedSyncBlockDeletionStatus,
					retryCreationPosMap,
					hasSyncedBlocks: prevHasSyncedBlocks,
					statusDecorationSet: prevStatusDecorationSet,
					prevIsOffline: prevOffline,
					prevIsViewMode: prevViewMode,
					prevIsDragging: prevDragging,
				} = currentPluginState;

				// Lazy-init bookkeeping: once a synced block enters the document we
				// flip `hasSyncedBlocks` to `true` for the lifetime of this editor
				let nextHasSyncedBlocks = prevHasSyncedBlocks;
				if (!prevHasSyncedBlocks && tr.docChanged && isPerfExperimentOn) {
					if (transactionInsertsSyncedBlock(tr)) {
						nextHasSyncedBlocks = true;
					}
				}

				// --- Fast path (EDITOR-6929): when `hasSyncedBlocks` is false,
				// no meta is set, and the selection/doc haven't changed in a way
				// that affects our state, return the SAME object reference so
				// SharedStateAPI skips notifying subscribers. ---
				if (
					!nextHasSyncedBlocks &&
					!meta &&
					!tr.docChanged &&
					tr.selection.eq(oldEditorState.selection) &&
					isPerfExperimentOn
				) {
					return currentPluginState;
				}

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

				// --- Status decoration set (EDITOR-6930) ---
				// When the perf gate is ON we maintain `statusDecorationSet` in
				// plugin state so the `decorations` prop becomes an O(1) lookup.
				let nextStatusDecorationSet = prevStatusDecorationSet;
				let nextIsOffline = prevOffline;
				let nextIsViewMode = prevViewMode;
				let nextIsDragging = prevDragging;

				if (isPerfExperimentOn) {
					if (!nextHasSyncedBlocks) {
						// No synced blocks → keep empty status decorations
						nextStatusDecorationSet = DecorationSet.empty;
					} else {
						// Read current shared-state signals
						nextIsOffline = isOfflineMode(api?.connectivity?.sharedState.currentState()?.mode);
						nextIsViewMode = api?.editorViewMode?.sharedState.currentState()?.mode === 'view';
						nextIsDragging =
							api?.userIntent?.sharedState.currentState()?.currentUserIntent === 'dragging';

						// Determine whether we need a full rebuild or a cheap map
						const hasSyncedBlocksJustFlipped = nextHasSyncedBlocks && !prevHasSyncedBlocks;
						const statusSignalChanged =
							nextIsOffline !== prevOffline ||
							nextIsViewMode !== prevViewMode ||
							nextIsDragging !== prevDragging;
						// Meta-driven status changes (e.g. pending creation
						// completed, retry creation pos updated)
						const hasMetaStatusChange = !!meta?.retryCreationPos || !!meta?.activeFlag;

						if (hasSyncedBlocksJustFlipped || statusSignalChanged || hasMetaStatusChange) {
							// Full rebuild — a status signal changed
							nextStatusDecorationSet = buildStatusDecorations(
								tr.doc,
								syncBlockStore,
								nextIsOffline,
								nextIsViewMode,
								nextIsDragging,
							);
						} else if (tr.docChanged) {
							// Cheap map — positions shifted but status unchanged
							nextStatusDecorationSet = prevStatusDecorationSet.map(tr.mapping, tr.doc);
						}
						// else: nothing changed, keep same reference
					}
				}

				const newPosEntry = meta?.retryCreationPos;
				const newRetryCreationPosMap = mapRetryCreationPosMap(
					retryCreationPosMap,
					newPosEntry,
					tr.mapping.map.bind(tr.mapping),
				);

				const nextActiveFlag = meta?.activeFlag ?? activeFlag;
				const nextBodiedSyncBlockDeletionStatus =
					meta?.bodiedSyncBlockDeletionStatus ?? bodiedSyncBlockDeletionStatus;
				const nextHasUnsavedBodiedSyncBlockChanges =
					syncBlockStore.sourceManager.hasUnsavedChanges();

				// --- Reference equality (EDITOR-6929): return the same object
				// when ALL fields are reference-equal to avoid SharedStateAPI
				// notifying subscribers and triggering React re-renders. ---
				if (
					nextActiveFlag === activeFlag &&
					newDecorationSet === selectionDecorationSet &&
					newRetryCreationPosMap === retryCreationPosMap &&
					nextHasSyncedBlocks === prevHasSyncedBlocks &&
					nextBodiedSyncBlockDeletionStatus === bodiedSyncBlockDeletionStatus &&
					nextHasUnsavedBodiedSyncBlockChanges ===
						currentPluginState.hasUnsavedBodiedSyncBlockChanges &&
					nextStatusDecorationSet === prevStatusDecorationSet &&
					nextIsOffline === prevOffline &&
					nextIsViewMode === prevViewMode &&
					nextIsDragging === prevDragging &&
					isPerfExperimentOn
				) {
					return currentPluginState;
				}

				return {
					activeFlag: nextActiveFlag,
					selectionDecorationSet: newDecorationSet,
					syncBlockStore: syncBlockStore,
					retryCreationPosMap: newRetryCreationPosMap,
					hasSyncedBlocks: nextHasSyncedBlocks,
					bodiedSyncBlockDeletionStatus: nextBodiedSyncBlockDeletionStatus,
					hasUnsavedBodiedSyncBlockChanges: nextHasUnsavedBodiedSyncBlockChanges,
					statusDecorationSet: nextStatusDecorationSet,
					prevIsOffline: nextIsOffline,
					prevIsViewMode: nextIsViewMode,
					prevIsDragging: nextIsDragging,
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
				if (!currentPluginState) {
					return DecorationSet.empty;
				}

				const {
					selectionDecorationSet,
					statusDecorationSet,
					hasSyncedBlocks: docHasSyncedBlocks,
				} = currentPluginState;

				// When the perf gate is ON, both `selectionDecorationSet` and
				// `statusDecorationSet` are maintained in plugin state by
				// `apply()`. The `decorations` prop is now an O(1) merge of
				// the two cached sets — no `doc.descendants()` walk, no
				// shared-state reads.
				if (expValEquals('editor_synced_block_perf', 'isEnabled', true)) {
					if (!docHasSyncedBlocks) {
						return selectionDecorationSet;
					}

					// Focus state is read live here (single cheap read) because
					// it only gates whether selection decorations are included —
					// it does not affect the status decoration set and can change
					// within the same transaction cycle.
					const hasFocus = api?.focus?.sharedState?.currentState()?.hasFocus ?? true;

					// Merge selection + status decorations.
					// When the editor is unfocused,
					// omit selection decorations (matches old behaviour).
					const statusDecorations = statusDecorationSet.find();
					if (statusDecorations.length === 0) {
						return hasFocus ? selectionDecorationSet : DecorationSet.empty;
					} else {
						return hasFocus
							? selectionDecorationSet.add(state.doc, statusDecorations)
							: statusDecorationSet;
					}
				} else {
					// --- Legacy path (perf gate OFF) ---
					// Full `doc.descendants()` walk every transaction. Preserved
					// for safe rollback.
					const syncBlockStore: SyncBlockStoreManager = currentPluginState.syncBlockStore;
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

						if (isDragging && syncBlockStore.isSyncBlock(node)) {
							dragDecorations.push(
								Decoration.node(pos, pos + node.nodeSize, {
									class: SyncBlockStateCssClassName.draggingClassName,
								}),
							);
						}
					});

					if (api?.focus?.sharedState?.currentState()?.hasFocus) {
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
			// Lazy-init: when no synced block currently exists in the doc and the
			// transaction does not insert one, all downstream filter logic is a
			// no-op. Avoid both the shared-state reads and the `trackSyncBlocks`
			// walks for the ~99.97% of pages that have no synced blocks.
			if (expValEquals('editor_synced_block_perf', 'isEnabled', true)) {
				const pluginState = syncedBlockPluginKey.getState(state);
				if (pluginState && !pluginState.hasSyncedBlocks && !transactionInsertsSyncedBlock(tr)) {
					return true;
				}
			}

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

					// Fetch statuses for remotely-added source sync blocks
					// so we can identify unpublished blocks on cancel
					if (sourceSyncBlockNodes.length > 0 && fg('platform_synced_block_patch_10')) {
						syncBlockStore.sourceManager.fetchAndCacheStatuses();
					}

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
			// Lazy-init: when neither the previous nor the new state contains a
			// synced block (and none of the dispatched transactions inserts one),
			// skip all downstream work. This is the hot path on the ~99.97% of
			// pages that don't use synced blocks (see EDITOR-6586).
			if (expValEquals('editor_synced_block_perf', 'isEnabled', true)) {
				const oldPluginState = syncedBlockPluginKey.getState(oldState);
				const newPluginState = syncedBlockPluginKey.getState(newState);
				const hadOrHasSyncedBlocks =
					!!oldPluginState?.hasSyncedBlocks || !!newPluginState?.hasSyncedBlocks;
				if (!hadOrHasSyncedBlocks) {
					return null;
				}
			}

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
