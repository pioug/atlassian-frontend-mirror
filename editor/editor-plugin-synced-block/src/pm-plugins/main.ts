import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
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
import { Slice } from '@atlaskit/editor-prosemirror/model';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, PluginKey } from '@atlaskit/editor-prosemirror/state';
import { ReplaceAroundStep, ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import { DecorationSet, Decoration } from '@atlaskit/editor-prosemirror/view';
import { convertPMNodesToSyncBlockNodes } from '@atlaskit/editor-synced-block-provider';
import type {
	SyncBlockProduct,
	SyncBlockStoreManager,
} from '@atlaskit/editor-synced-block-provider';
import type {
	DeletionReason,
	DeletionMechanism,
} from '@atlaskit/editor-synced-block-provider/common/types';
import { getSourceProductFromResourceIdSafe } from '@atlaskit/editor-synced-block-provider/utils';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import { bodiedSyncBlockNodeView } from '../nodeviews/bodiedSyncedBlock';
import { SyncBlock as SyncBlockView } from '../nodeviews/syncedBlock';
import type {
	SyncedBlockFeedbackContext,
	SyncedBlockPlugin,
	SyncedBlockPluginOptions,
} from '../syncedBlockPluginType';
import { FLAG_ID } from '../types';
import type {
	ActiveFlag,
	BodiedSyncBlockDeletionStatus,
	RetryCreationPosEntry,
	RetryCreationPosMap,
} from '../types';

import { handleBodiedSyncBlockCreation } from './utils/handle-bodied-sync-block-creation';
import { handleBodiedSyncBlockRemoval } from './utils/handle-bodied-sync-block-removal';
import type {
	SourceFeedbackCallbacks,
	TransactionRef,
} from './utils/handle-bodied-sync-block-removal';
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

/**
 * Dedicated transaction-meta {@link PluginKey} the synced-block removal command
 * sets so {@link getDeleteMechanism} can report a toolbar Delete as
 * `deleteButton` (otherwise indistinguishable from a keyboard delete — both are
 * plain ReplaceSteps). A separate key (rather than `syncedBlockPluginKey`, which
 * carries plugin-state transitions read in `apply()`, or a bare string) keeps
 * this transient signal uniquely namespaced and isolated.
 */
export const deleteMechanismMetaKey: PluginKey<DeletionMechanism> =
	new PluginKey<DeletionMechanism>('syncedBlockDeleteMechanism');

type PromptedFeedbackMeta = {
	context: SyncedBlockFeedbackContext;
	sourceAttempt?: symbol;
};

const syncedBlockPromptedFeedbackMetaKey: PluginKey<PromptedFeedbackMeta> =
	new PluginKey<PromptedFeedbackMeta>('syncedBlockPromptedFeedback');

/**
 * Creation analytics signals set by {@link createSyncedBlock} on the creating
 * transaction. The async creation handler forwards them to the store manager,
 * which attaches them to the `syncedBlockCreate` event. A dedicated key keeps
 * this transient signal isolated from plugin state.
 */
export type SyncedBlockCreationMeta = {
	createdEmpty?: boolean;
	inputMethod?: INPUT_METHOD;
	nodeTypes?: string[];
};
export const creationMetaKey: PluginKey<SyncedBlockCreationMeta> =
	new PluginKey<SyncedBlockCreationMeta>('syncedBlockCreationMeta');

type SyncedBlockPluginState = {
	activeFlag: ActiveFlag;
	bodiedSyncBlockDeletionStatus?: BodiedSyncBlockDeletionStatus;
	/**
	 * Tracks whether the document currently contains any synced block (source or
	 * reference). When `false`, downstream work in `appendTransaction`,
	 * `decorations`, and the `contentComponent` short-circuits to avoid the
	 * per-transition feature tax on the ~99.97% of pages that have no synced
	 * blocks (see EDITOR-6586).
	 */
	hasSyncedBlocks: boolean;
	hasUnsavedBodiedSyncBlockChanges?: boolean;
	/**
	 * Cached previous values for shared-state signals. Used inside `apply()` to
	 * detect when a status change requires a full rebuild of `statusDecorationSet`
	 * instead of a cheap `map()` call.
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
	if (!resourceId && oldMap.size === 0) {
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

const showCopiedFlag = (
	api: ExtractInjectionAPI<SyncedBlockPlugin> | undefined,
	isLivePage: boolean | undefined,
	isSourceContentUnpublished: boolean,
	sourceProduct: SyncBlockProduct | undefined,
) => {
	deferDispatch(() => {
		api?.core.actions.execute(({ tr }) =>
			tr.setMeta(syncedBlockPluginKey, {
				activeFlag: {
					id: FLAG_ID.SYNC_BLOCK_COPIED,
					isLivePage,
					isSourceContentUnpublished,
					sourceProduct,
				},
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

/** Narrows the history plugin meta, matching the editor-plugin-card pattern. */
const isHistoryMeta = (meta: unknown): meta is { redo: boolean } =>
	typeof meta === 'object' &&
	meta !== null &&
	'redo' in meta &&
	typeof (meta as { redo: unknown }).redo === 'boolean';

/**
 * Derive how a source bodiedSyncBlock removal was performed, for the `mechanism`
 * analytics dimension. Each value names the user action; most-specific wins:
 *  - `undo` / `redo` — history transaction.
 *  - `deleteButton` — the explicit "Delete" control in the synced-block toolbar
 *    (the removal command tags its transaction with {@link deleteMechanismMetaKey}).
 *  - `selectionReplaced` — ReplaceStep on a node-selected block (the
 *    accidental-overwrite path: block selected, then typed/pasted over).
 *  - `keyboardDelete` — ReplaceStep removal at a caret/range selection
 *    (Backspace/Delete key).
 *  - `other` — anything else (unsync, conversion, code-dispatched, or a
 *    structural `ReplaceAroundStep` such as wrap/lift/unwrap).
 *
 * Only a plain `ReplaceStep` counts as a direct user deletion. `ReplaceAroundStep`
 * is used for wrapping/lifting/unwrapping content, not direct removal, so a
 * removal carried by one is classified as `other` rather than misreported as a
 * keyboard delete.
 *
 * `state` is the pre-transaction state, so its selection reflects what was
 * selected when the edit was made.
 */
export const getDeleteMechanism = (tr: Transaction, state: EditorState): DeletionMechanism => {
	// Keep the legacy analytics classification unchanged while activation is off.
	// The stricter history, structural-step, and reference-selection handling is
	// only needed by the prompted feedback rollout.
	const isSyncBlockActivationEnabled = expValEqualsNoExposure(
		'platform_editor_sync_block_activation',
		'isEnabled',
		true,
	);
	const historyMeta = tr.getMeta(pmHistoryPluginKey);
	if (historyMeta) {
		if (isSyncBlockActivationEnabled && !isHistoryMeta(historyMeta)) {
			return 'other';
		}
		return isHistoryMeta(historyMeta) && historyMeta.redo ? 'redo' : 'undo';
	}

	// The toolbar Delete control tags its transaction so we can report it
	// distinctly from a keyboard delete (both produce a plain ReplaceStep).
	if (tr.getMeta(deleteMechanismMetaKey) === 'deleteButton') {
		return 'deleteButton';
	}

	const hasStructuralStep =
		isSyncBlockActivationEnabled && tr.steps.some((step) => step instanceof ReplaceAroundStep);
	const hasReplaceStep = tr.steps.some((step) => step instanceof ReplaceStep);
	if (hasStructuralStep || !hasReplaceStep) {
		return 'other';
	}

	const { selection } = state;
	const isNodeSelected =
		selection instanceof NodeSelection &&
		(selection.node?.type.name === 'bodiedSyncBlock' ||
			(isSyncBlockActivationEnabled && selection.node?.type.name === 'syncBlock'));
	return isNodeSelected ? 'selectionReplaced' : 'keyboardDelete';
};

export const getPromptedFeedbackEntryPoint = (
	mechanism: DeletionMechanism,
): SyncedBlockFeedbackContext['entryPoint'] | undefined => {
	if (mechanism === 'undo') {
		return 'prompted-undo';
	}
	if (
		mechanism === 'deleteButton' ||
		mechanism === 'keyboardDelete' ||
		mechanism === 'selectionReplaced'
	) {
		return 'prompted-delete';
	}
	return undefined;
};

type FilterTransactionOnlineParams = {
	api: ExtractInjectionAPI<SyncedBlockPlugin> | undefined;
	bodiedSyncBlockAdded: ReturnType<typeof trackSyncBlocks>['added'];
	bodiedSyncBlockRemoved: ReturnType<typeof trackSyncBlocks>['removed'];
	confirmationTransactionRef: TransactionRef;
	ctx: SyncedBlockPluginContext;
	extensionFlagShown: Set<string>;
	state: EditorState;
	syncBlockStore: SyncBlockStoreManager;
	tr: Transaction;
};

/**
 * True when a source `bodiedSyncBlock` holds user content — i.e. not just the
 * single empty paragraph it is created with (used to detect empty→content).
 */
const bodiedSyncBlockHasContent = (node: Node): boolean => {
	if (node.childCount === 0) {
		return false;
	}
	if (node.childCount === 1) {
		const child = node.firstChild;
		// A freshly-created block is a single empty paragraph; anything else
		// (non-empty paragraph, or a different/first block) counts as content.
		return !(child?.type.name === 'paragraph' && child.content.size === 0);
	}
	return true;
};

/**
 * Ask the store manager to fire the one-shot first-content-added event for every
 * populated source block. The manager only emits for blocks it created empty
 * this session and dedupes per block, so iterating all populated blocks is safe
 * and self-limiting. Called only when `hasEditInSyncBlock` flagged an in-block
 * edit, so this walk runs rarely.
 */
const emitFirstContentAddedForEditedBlocks = (
	tr: Transaction,
	state: EditorState,
	syncBlockStore: SyncBlockStoreManager,
): void => {
	const { bodiedSyncBlock } = state.schema.nodes;
	tr.doc.descendants((node) => {
		if (node.type === bodiedSyncBlock) {
			if (bodiedSyncBlockHasContent(node)) {
				syncBlockStore.sourceManager.maybeEmitFirstContentAdded(
					node.attrs.resourceId,
					node.attrs.localId,
				);
			}
			// bodiedSyncBlocks are top-level and not nested, so no need to descend.
			return false;
		}
		return true;
	});
};

const filterTransactionOnline = ({
	tr,
	state,
	syncBlockStore,
	api,
	confirmationTransactionRef,
	ctx,
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

	// Annotate every reference-block insertion with `sourceProduct`
	// (derived from the resourceId) and `isPaste` (when the originating transaction was a
	// paste). Together with the host product reported by the embedding product's pageview
	// events this lets us triangulate cross-product paste behaviour without standing up a
	// dedicated `cross_product_paste` event subject.
	const isPaste = Boolean(tr.getMeta('paste') ?? tr.getMeta('uiEvent') === 'paste');
	const isPasteOrDrop = isPaste || tr.getMeta('uiEvent') === 'drop';
	const hasRemovedSyncBlock = syncBlockRemoved.length > 0 || bodiedSyncBlockRemoved.length > 0;
	const isCutRemoval = hasRemovedSyncBlock && ctx.consumeCutRemoval();
	const canPromptForRemoval =
		Boolean(ctx.onGiveFeedback) &&
		hasRemovedSyncBlock &&
		!isDirtyTransaction(tr) &&
		!isCutRemoval &&
		!isPasteOrDrop;
	const promptedFeedbackEntryPoint = canPromptForRemoval
		? getPromptedFeedbackEntryPoint(getDeleteMechanism(tr, state))
		: undefined;
	const entryPoint =
		promptedFeedbackEntryPoint &&
		expValEqualsNoExposure('platform_editor_sync_block_activation', 'isEnabled', true)
			? promptedFeedbackEntryPoint
			: undefined;

	if (entryPoint && syncBlockRemoved.length > 0 && bodiedSyncBlockRemoved.length === 0) {
		tr.setMeta(syncedBlockPromptedFeedbackMetaKey, {
			context: {
				blockType: 'reference',
				entryPoint,
			},
		});
	}

	syncBlockAdded.forEach((syncBlock) => {
		api?.analytics?.actions?.fireAnalyticsEvent({
			action: ACTION.INSERTED,
			actionSubject: ACTION_SUBJECT.DOCUMENT,
			actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK,
			attributes: {
				resourceId: syncBlock.attrs.resourceId,
				blockInstanceId: syncBlock.attrs.localId,
				sourceProduct: getSourceProductFromResourceIdSafe(syncBlock.attrs.resourceId),
				isPaste,
			},
			eventType: EVENT_TYPE.TRACK,
		});
	});

	if (bodiedSyncBlockRemoved.length > 0) {
		// Recompute the delete fresh from the live document on confirm
		// (see handleBodiedSyncBlockRemoval). See EDITOR-7889.
		const mechanism = getDeleteMechanism(tr, state);
		const feedbackContext =
			entryPoint && getDeleteReason(tr) !== 'source-block-unsynced'
				? ({
						blockType: 'source',
						entryPoint,
					} satisfies SyncedBlockFeedbackContext)
				: undefined;
		let feedbackCallbacks: SourceFeedbackCallbacks | undefined;
		if (feedbackContext) {
			const sourceAttempt = ctx.queueSourceFeedback(feedbackContext);
			feedbackCallbacks = {
				onDeleteCompleted: (success) => ctx.completeSourceDeletion(sourceAttempt, success),
				onDeleteTransaction: (deleteTr) =>
					deleteTr.setMeta(syncedBlockPromptedFeedbackMetaKey, {
						context: feedbackContext,
						sourceAttempt,
					}),
				onDestroy: () => ctx.clearSourceFeedback(sourceAttempt),
			};
		}
		return handleBodiedSyncBlockRemoval({
			removed: bodiedSyncBlockRemoved,
			syncBlockStore,
			api,
			confirmationTransactionRef,
			deletionReason: getDeleteReason(tr),
			mechanism,
			feedbackCallbacks,
		});
	}

	if (bodiedSyncBlockAdded.length > 0) {
		if (tr.getMeta(pmHistoryPluginKey)) {
			// We don't allow bodiedSyncBlock creation via redo, however, we need to return true here to let transaction through so history can be updated properly.
			// If we simply returns false, creation from redo is blocked as desired, but this results in editor showing redo as possible even though it's not.
			// After true is returned here and the node is created, we delete the node in the filterTransaction immediately, which cancels out the creation
			return true;
		}

		// Defense-in-depth: if a bodiedSyncBlock arrives via paste or drag-and-drop,
		// it may have bypassed transformCopied (e.g. cut, browser clipboard).
		// Do not call createBlock — it would use this page's parentId which may
		// be wrong. The bodiedSyncBlock content will still be inserted but will
		// not be registered as a source block in Block Service, which is safer
		// than creating a zombie block under the wrong ARI.
		if (isPasteOrDrop) {
			return true;
		}

		// Forward creation analytics signals captured by createSyncedBlock onto the async
		// `syncedBlockCreate` success event.
		const creationMeta = tr.getMeta(creationMetaKey) as SyncedBlockCreationMeta | undefined;
		handleBodiedSyncBlockCreation(bodiedSyncBlockAdded, state, api, creationMeta);
		return true;
	}

	// On an in-block edit, let the store manager fire the one-shot first-content
	// event (dedupe + empty→content scoping live there). After the add/remove
	// branches so it never runs for the creation transaction itself.
	if (hasEditInSyncBlock(tr, state)) {
		emitFirstContentAddedForEditedBlocks(tr, state, syncBlockStore);
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
	private _cutRemovalPending = false;
	private cutRemovalGeneration = 0;
	private _isCopyEvent = false;
	private _isCutEvent = false;
	private feedbackPromptConsumed = false;
	private pendingSourceFeedback:
		| {
				context: SyncedBlockFeedbackContext;
				deletionSucceeded: boolean;
				sourceAttempt: symbol;
				transactionApplied: boolean;
		  }
		| undefined;
	readonly unpublishedFlagShown = new Set<string>();
	readonly extensionFlagShown = new Set<string>();

	constructor(
		readonly onGiveFeedback: SyncedBlockPluginOptions['onGiveFeedback'],
		readonly shouldShowFeedbackPrompt: SyncedBlockPluginOptions['shouldShowFeedbackPrompt'],
		private readonly api: ExtractInjectionAPI<SyncedBlockPlugin> | undefined,
	) {}

	get isCopyEvent(): boolean {
		return this._isCopyEvent;
	}

	markCopyEvent(): void {
		this._isCopyEvent = true;
	}

	markCutEvent(): void {
		this._isCutEvent = true;
	}

	consumeCopyEvent(): boolean {
		const was = this._isCopyEvent;
		this._isCopyEvent = false;
		return was;
	}

	consumeCutEvent(): boolean {
		const was = this._isCutEvent;
		this._isCutEvent = false;
		return was;
	}

	markCutRemovalPending(): void {
		this._cutRemovalPending = true;
		const generation = ++this.cutRemovalGeneration;
		queueMicrotask(() => {
			if (this.cutRemovalGeneration === generation) {
				this._cutRemovalPending = false;
			}
		});
	}

	consumeCutRemoval(): boolean {
		const wasPending = this._cutRemovalPending;
		this._cutRemovalPending = false;
		this.cutRemovalGeneration += 1;
		return wasPending;
	}

	queueSourceFeedback(context: SyncedBlockFeedbackContext): symbol {
		const sourceAttempt = Symbol('syncedBlockSourceFeedbackAttempt');
		this.pendingSourceFeedback = {
			context,
			deletionSucceeded: false,
			sourceAttempt,
			transactionApplied: false,
		};
		return sourceAttempt;
	}

	completeSourceDeletion(sourceAttempt: symbol, success: boolean): void {
		if (this.pendingSourceFeedback?.sourceAttempt !== sourceAttempt) {
			return;
		}
		if (!success) {
			// Keep the attempt pending because retryDeletion reuses these callbacks.
			// Dismissal or cancellation clears it through the destroy callback.
			return;
		}
		this.pendingSourceFeedback.deletionSucceeded = true;
		this.flushSourceFeedback(sourceAttempt);
	}

	clearSourceFeedback(sourceAttempt: symbol): void {
		if (this.pendingSourceFeedback?.sourceAttempt === sourceAttempt) {
			this.pendingSourceFeedback = undefined;
		}
	}

	handleAppliedFeedback({ context, sourceAttempt }: PromptedFeedbackMeta): void {
		if (
			context.blockType === 'source' &&
			sourceAttempt &&
			this.pendingSourceFeedback?.sourceAttempt === sourceAttempt
		) {
			this.pendingSourceFeedback.transactionApplied = true;
			this.flushSourceFeedback(sourceAttempt);
			return;
		}
		if (context.blockType === 'reference') {
			this.requestFeedbackPrompt(context);
		}
	}

	private flushSourceFeedback(sourceAttempt: symbol): void {
		if (
			this.pendingSourceFeedback?.sourceAttempt === sourceAttempt &&
			this.pendingSourceFeedback?.deletionSucceeded &&
			this.pendingSourceFeedback.transactionApplied
		) {
			const { context } = this.pendingSourceFeedback;
			this.pendingSourceFeedback = undefined;
			this.requestFeedbackPrompt(context);
		}
	}

	private requestFeedbackPrompt(context: SyncedBlockFeedbackContext): void {
		if (this.feedbackPromptConsumed) {
			return;
		}
		this.feedbackPromptConsumed = true;

		deferDispatch(() => {
			try {
				const shouldShow = this.shouldShowFeedbackPrompt?.() ?? true;
				void Promise.resolve(shouldShow)
					.then((isEligible) => {
						if (!isEligible) {
							return;
						}
						this.api?.core.actions.execute(({ tr }) =>
							tr.setMeta(syncedBlockPluginKey, {
								activeFlag: {
									id: FLAG_ID.SYNC_BLOCK_FEEDBACK_PROMPT,
									feedbackContext: context,
								},
							}),
						);
					})
					.catch(() => {});
			} catch {
				// Persisted feedback eligibility is optional product UI.
			}
		});
	}
}

export const createPlugin = (
	options: SyncedBlockPluginOptions | undefined,
	pmPluginFactoryParams: PMPluginFactoryParams,
	syncBlockStore: SyncBlockStoreManager,
	api?: ExtractInjectionAPI<SyncedBlockPlugin>,
): SafePlugin<SyncedBlockPluginState> => {
	const { useLongPressSelection = false } = options || {};

	const ctx = new SyncedBlockPluginContext(
		options?.onGiveFeedback,
		options?.shouldShowFeedbackPrompt,
		api,
	);
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

	// Trigger a deferred flush when block creation completes after the initial
	// flush timed out waiting for it. This ensures content created from
	// existing text is eventually persisted even if no further edits are made.
	// See EDITOR-7112.
	syncBlockStore.sourceManager.registerPostCreationFlushCallback(() => {
		deferDispatch(() => {
			syncBlockStore.sourceManager.flush();
		});
	});

	// Set up callback to detect unpublished sync blocks when they're fetched
	syncBlockStore.referenceManager.setOnUnpublishedSyncBlockDetected((resourceId: string) => {
		// Only show the flag once per sync block
		if (!unpublishedFlagShown.has(resourceId)) {
			unpublishedFlagShown.add(resourceId);
			// Surface the source product so the flag's copy can be tailored — Jira work
			// items get "Pasted from unsaved item" / "...when the item's description is
			// saved" rather than the Confluence page-flavoured default. Falls back to
			// undefined when the resourceId can't be parsed (legacy shapes), in which
			// case the Confluence default is used.
			const sourceProduct = getSourceProductFromResourceIdSafe(resourceId);
			deferDispatch(() => {
				api?.core.actions.execute(({ tr }) =>
					tr.setMeta(syncedBlockPluginKey, {
						activeFlag: { id: FLAG_ID.UNPUBLISHED_SYNC_BLOCK_PASTED, sourceProduct },
					}),
				);
			});
		}
	});

	return new SafePlugin<SyncedBlockPluginState>({
		key: syncedBlockPluginKey,
		state: {
			init(_, instance: EditorState): SyncedBlockPluginState {
				// When the document has no synced blocks, we skip the eager fetch +
				// cache walks. They will be re-run lazily by `apply` the first time a
				// synced block enters the document (paste, collab insert, or
				// programmatic insert).
				const docHasSyncedBlocks = hasSyncedBlocks(instance.doc);

				if (docHasSyncedBlocks) {
					const syncBlockNodes = instance.doc.children.filter(
						syncBlockStore.referenceManager.isReferenceBlock,
					);
					syncBlockStore.referenceManager.fetchSyncBlocksData(
						convertPMNodesToSyncBlockNodes(syncBlockNodes),
					);

					// Populate source sync block cache from initial document.
					// This replaces the constructor call in the nodeview.
					instance.doc.forEach((node) => {
						if (syncBlockStore.sourceManager.isSourceBlock(node)) {
							syncBlockStore.sourceManager.updateSyncBlockData(node, false);
						}
					});

					// Fetch statuses from the backend so we can identify unpublished blocks on cancel
					syncBlockStore.sourceManager.fetchAndCacheStatuses();
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
				const initStatusDecorationSet = docHasSyncedBlocks
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

				// Pre-compute once so the fast-path probe and the bottom ref-equality
				// short-circuit share the same source-manager snapshot. Track C will make this O(1).
				const nextHasUnsavedBodiedSyncBlockChanges =
					syncBlockStore.sourceManager.hasUnsavedChanges();

				// --- Fast path (EDITOR-6934 follow-up, see Confluence 7050540723 §9.3 / §9.9):
				// when no plugin meta is set, and neither the document nor selection changed,
				// most synced-block plugin state cannot change. The source manager is mutable
				// outside ProseMirror transactions, though, so preserve existing empty-transaction
				// sync semantics by checking that snapshot first.
				//
				// Note: selection-only transactions intentionally fall through to the normal
				// apply path because calculateDecorations depends on drag/view-mode state
				// that is not captured here.
				//
				// We also need to ensure shared-state signals (drag, offline, view-mode)
				// haven't changed — these are propagated via empty transactions and drive
				// status decoration rebuilds (e.g. drag border). Without this check the
				// fast path would swallow drag-start transactions and the synced block
				// border would never appear (see VR test: synced-block-drag-selection).
				if (
					!meta &&
					!tr.docChanged &&
					tr.selection.eq(oldEditorState.selection) &&
					nextHasUnsavedBodiedSyncBlockChanges ===
						currentPluginState.hasUnsavedBodiedSyncBlockChanges &&
					(api?.userIntent?.sharedState.currentState()?.currentUserIntent === 'dragging') ===
						prevDragging &&
					isOfflineMode(api?.connectivity?.sharedState.currentState()?.mode) === prevOffline &&
					(api?.editorViewMode?.sharedState.currentState()?.mode === 'view') === prevViewMode
				) {
					return currentPluginState;
				}

				// Lazy-init bookkeeping: once a synced block enters the document we
				// flip `hasSyncedBlocks` to `true` for the lifetime of this editor
				let nextHasSyncedBlocks = prevHasSyncedBlocks;
				if (!prevHasSyncedBlocks && tr.docChanged) {
					if (transactionInsertsSyncedBlock(tr)) {
						nextHasSyncedBlocks = true;
					}
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

				const newPosEntry = meta?.retryCreationPos;
				const newRetryCreationPosMap = mapRetryCreationPosMap(
					retryCreationPosMap,
					newPosEntry,
					tr.mapping.map.bind(tr.mapping),
				);

				const nextActiveFlag = meta?.activeFlag ?? activeFlag;
				const nextBodiedSyncBlockDeletionStatus =
					meta?.bodiedSyncBlockDeletionStatus ?? bodiedSyncBlockDeletionStatus;

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
					nextIsDragging === prevDragging
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
						intl: pmPluginFactoryParams.getIntl(),
					}).init(),
				bodiedSyncBlock: bodiedSyncBlockNodeView({
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
				cut: () => {
					ctx.consumeCutEvent();
					ctx.markCutEvent();
					return false;
				},
			},
			transformPasted: (slice, _view) => {
				// Defense against bodiedSyncBlock nodes arriving via paste
				// (e.g. drag-and-drop, cut-paste, or browser-level clipboard
				// operations that bypass the transformCopied handler).
				// We cannot convert to a syncBlock reference here because we don't
				// know the source page's parentId (generateResourceIdForReference
				// would use the current page's parentId which is wrong).
				// Instead, strip the bodiedSyncBlock wrapper and keep only the
				// inner content to prevent createBlock being called with the
				// wrong parentId.
				return mapSlice(slice, (node: Node) => {
					if (node.type.name === 'bodiedSyncBlock' && node.attrs.resourceId) {
						// Return the inner content without the sync block wrapper.
						// This is the same behavior as when a partial selection of
						// a bodiedSyncBlock is copied (see transformCopied line 937).
						return node.content;
					}
					return node;
				});
			},
			transformCopied: (slice, { state }) => {
				const pluginState = syncedBlockPluginKey.getState(state);
				const syncBlockStore = pluginState?.syncBlockStore;
				const { schema } = state;
				const isCopy = ctx.consumeCopyEvent();
				const isCut = ctx.consumeCutEvent();
				// A prompted feedback cut is always a cut, so the two never need combining.
				const isPromptedFeedbackCut =
					Boolean(syncBlockStore && options?.onGiveFeedback && isCut) &&
					expValEqualsNoExposure('platform_editor_sync_block_activation', 'isEnabled', true);

				if (!syncBlockStore || (!isCopy && !isCut)) {
					return slice;
				}

				let containsCutSyncBlock = false;
				const transformedSlice = mapSlice(slice, (node: Node) => {
					if (syncBlockStore.referenceManager.isReferenceBlock(node)) {
						if (isCut) {
							containsCutSyncBlock = isPromptedFeedbackCut;
							return node;
						}
						showCopiedFlag(
							api,
							options?.__livePage,
							syncBlockStore.referenceManager.getFromCache(node.attrs.resourceId)?.data?.status ===
								'unpublished',
							getSourceProductFromResourceIdSafe(node.attrs.resourceId),
						);

						return node;
					}
					if (node.type.name === 'bodiedSyncBlock' && node.attrs.resourceId) {
						if (isPromptedFeedbackCut && sliceFullyContainsNode(slice, node)) {
							containsCutSyncBlock = true;
						}
						// if we only selected part of the bodied sync block content,
						// remove the sync block node and only keep the content
						if (!sliceFullyContainsNode(slice, node)) {
							return node.content;
						}

						if (isCut) {
							return node;
						}

						const newResourceId = syncBlockStore.referenceManager.generateResourceIdForReference(
							node.attrs.resourceId,
						);
						showCopiedFlag(
							api,
							options?.__livePage,
							syncBlockStore.sourceManager.getStatus(node.attrs.resourceId) !== 'active',
							getSourceProductFromResourceIdSafe(newResourceId),
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
				if (containsCutSyncBlock) {
					ctx.markCutRemovalPending();
				}
				return transformedSlice;
			},
		},
		filterTransaction: (tr, state) => {
			// Lazy-init: when no synced block currently exists in the doc and the
			// transaction does not insert one, all downstream filter logic is a
			// no-op. Avoid both the shared-state reads and the `trackSyncBlocks`
			// walks for the ~99.97% of pages that have no synced blocks.
			const pluginState = syncedBlockPluginKey.getState(state);
			if (pluginState && !pluginState.hasSyncedBlocks && !transactionInsertsSyncedBlock(tr)) {
				return true;
			}

			const viewMode = api?.editorViewMode?.sharedState.currentState()?.mode;
			if (viewMode === 'view') {
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

			// if doc changed and it's a remote transaction, check if any synced block were added,
			// and if so, for source synced blocks, ensure we update the cache with them
			// and for reference synced blocks, ensure we fetch the data from the server
			if (tr.docChanged && tr.getMeta('isRemote')) {
				const { added } = trackSyncBlocks((node) => syncBlockStore.isSyncBlock(node), tr, state);
				const sourceSyncBlockNodes = added.filter(
					(nodeInfo) => nodeInfo.node && syncBlockStore.sourceManager.isSourceBlock(nodeInfo.node),
				);
				const referenceSyncBlockNodes = added.filter(
					(nodeInfo) =>
						nodeInfo.node && syncBlockStore.referenceManager.isReferenceBlock(nodeInfo.node),
				);

				sourceSyncBlockNodes.forEach((nodeInfo) => {
					if (nodeInfo.attrs?.resourceId && nodeInfo.node) {
						syncBlockStore.sourceManager.updateSyncBlockData(nodeInfo.node, tr.getMeta('isRemote'));
					}
				});

				// Fetch statuses for remotely-added source sync blocks
				// so we can identify unpublished blocks on cancel
				if (sourceSyncBlockNodes.length > 0) {
					syncBlockStore.sourceManager.fetchAndCacheStatuses();
				}

				const syncBlockNodes = referenceSyncBlockNodes
					.map((nodeInfo) => nodeInfo.node)
					.filter((node) => node !== undefined);
				syncBlockStore.referenceManager.fetchSyncBlocksData(
					convertPMNodesToSyncBlockNodes(syncBlockNodes),
				);
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
						ctx,
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
			const oldPluginState = syncedBlockPluginKey.getState(oldState);
			const newPluginState = syncedBlockPluginKey.getState(newState);
			const hadOrHasSyncedBlocks =
				!!oldPluginState?.hasSyncedBlocks || !!newPluginState?.hasSyncedBlocks;
			if (!hadOrHasSyncedBlocks) {
				return null;
			}

			const viewMode = api?.editorViewMode?.sharedState.currentState()?.mode;
			if (viewMode === 'view') {
				return null;
			}

			if (options?.onGiveFeedback) {
				const feedbackContexts = trs.flatMap((tr) => {
					const feedbackContext = tr.getMeta(syncedBlockPromptedFeedbackMetaKey);
					return feedbackContext ? [feedbackContext] : [];
				});

				if (
					feedbackContexts.length > 0 &&
					expValEqualsNoExposure('platform_editor_sync_block_activation', 'isEnabled', true)
				) {
					feedbackContexts.forEach((feedbackContext) => {
						ctx.handleAppliedFeedback(feedbackContext);
					});
				}
			}

			// Update source sync block cache for user-initiated changes only.
			// Cache updates are handled here instead of in the nodeview update() so we
			// can filter out non-user changes (remote collab, dirty programmatic txns).
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

			for (const tr of trs) {
				if (tr.getMeta(pmHistoryPluginKey)) {
					const { added } = trackSyncBlocks(
						syncBlockStore.sourceManager.isSourceBlock,
						tr,
						oldState,
					);

					if (added.length > 0) {
						// A bodiedSyncBlock must not be (re)created from history, i.e. redo of a
						// creation (see filterTransaction above). Unwrap it instead of deleting it:
						// deleting the whole node also dropped the content the block was converted
						// from (e.g. a table), and undoing that delete re-added the block and hit
						// this guard again, so the content was unrecoverable (EDITOR-8863).
						const { tr } = newState;
						if (isExperimentEnabled('platform_editor_blocks_exp_patch_10')) {
							// Unwrap in reverse document order so earlier replacements keep later
							// positions valid.
							[...added]
								.sort((a, b) => (b.from ?? 0) - (a.from ?? 0))
								.forEach(({ node, from, to }) => {
									if (node && from !== undefined && to !== undefined) {
										// This is ProseMirror's Transaction.replace (a document edit), not String.replace.
										// eslint-disable-next-line @atlassian/perf-linting/no-expensive-split-replace
										tr.replace(from, to, new Slice(node.content, 0, 0));
									}
								});
						} else {
							added.forEach((node) => {
								if (node.from !== undefined && node.to !== undefined) {
									tr.delete(node.from, node.to);
								}
							});
						}

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
			if (trs.some((tr) => tr.docChanged && !tr.getMeta('isRemote'))) {
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
