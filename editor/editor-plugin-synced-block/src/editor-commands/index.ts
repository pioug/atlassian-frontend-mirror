import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import {
	type INPUT_METHOD,
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	type DispatchAnalyticsEvent,
} from '@atlaskit/editor-common/analytics';
import { copyDomNode, toDOM } from '@atlaskit/editor-common/copy-button';
import type {
	Command,
	CommandDispatch,
	EditorCommand,
	ExtractInjectionAPI,
	TypeAheadInsert,
} from '@atlaskit/editor-common/types';
import {
	type Schema,
	DOMSerializer,
	Fragment,
	type Node as PMNode,
} from '@atlaskit/editor-prosemirror/model';
import {
	NodeSelection,
	Selection,
	TextSelection,
	type EditorState,
	type Transaction,
} from '@atlaskit/editor-prosemirror/state';
import {
	findSelectedNodeOfType,
	removeParentNodeOfType,
	removeSelectedNode,
	safeInsert,
} from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';
import { fg } from '@atlaskit/platform-feature-flags';

import { creationMetaKey, deleteMechanismMetaKey, syncedBlockPluginKey } from '../pm-plugins/main';
import {
	canBeConvertedToSyncBlock,
	deferDispatch,
	findSyncBlock,
	findSyncBlockOrBodiedSyncBlock,
	isBodiedSyncBlockNode,
} from '../pm-plugins/utils/utils';
import type { SyncedBlockPlugin } from '../syncedBlockPluginType';
import { FLAG_ID } from '../types';

import { findBodiedSyncBlockByLocalId, pasteSyncBlockHTMLContent } from './utils';

type createSyncedBlockProps = {
	fireAnalyticsEvent?: DispatchAnalyticsEvent;
	/**
	 * Creating surface, stashed on the transaction to attach to the async
	 * `syncedBlockCreate` event. Optional so legacy callers still type-check.
	 */
	inputMethod?: INPUT_METHOD;
	syncBlockStore: SyncBlockStoreManager;
	tr: Transaction;
	typeAheadInsert?: TypeAheadInsert;
};

/**
 * Place the caret on the first editable position inside the newly created bodied
 * sync block, identified by its unique localId.
 *
 * - Empty selection: lands inside the block's empty paragraph.
 * - Converted content: lands at the start of the first editable child.
 *
 * `createSyncedBlock` builds the node but neither `safeInsert` (empty case) nor
 * `replaceWith` (convert case) leaves the selection inside the new block, so
 * without this the caret ends up outside/adjacent to the block after creation
 * from the block menu or toolbar (EDITOR-7949). The typeahead path avoids this
 * because `typeAheadInsert` positions the caret for us.
 *
 * Note: when created from the block menu, block-controls' selection preservation
 * is active and will restore a whole-node NodeSelection over this caret. The
 * caller (block-menu item) is responsible for calling `stopPreservingSelection`
 * in the same flow so the caret survives — mirroring the block-menu delete item.
 */
const placeCaretInsideBodiedSyncBlock = (tr: Transaction, localId: string): Transaction => {
	const bodiedSyncBlockType = tr.doc.type.schema.nodes.bodiedSyncBlock;

	let blockPos: number | undefined;
	tr.doc.descendants((node, pos) => {
		if (blockPos !== undefined) {
			return false;
		}
		if (node.type === bodiedSyncBlockType && node.attrs.localId === localId) {
			blockPos = pos;
			return false;
		}
		return true;
	});

	if (blockPos === undefined) {
		return tr;
	}

	// Find the first valid text position at or after the block's start. `findFrom`
	// with textOnly=true descends into the first editable child (empty paragraph or
	// start of the converted content), which is exactly what we want for both cases.
	const selection = Selection.findFrom(tr.doc.resolve(blockPos), 1, true);
	if (selection) {
		tr.setSelection(selection).scrollIntoView();
	} else {
		// Fallback: `bodiedSyncBlock` is always created with a paragraph as its first
		// child, so a text position should always be found above. This guards against
		// future schema changes where the first child isn't immediately text-editable
		// — place the caret just inside the block rather than leaving it outside.
		// `blockPos + 1` is the position immediately after the block's opening token,
		// which is a node boundary rather than a valid text position, so use
		// `TextSelection.near` to snap forward to the nearest selectable cursor. It
		// also clamps to the document bounds internally, so no explicit end-of-doc
		// check is required.
		tr.setSelection(TextSelection.near(tr.doc.resolve(blockPos + 1), 1)).scrollIntoView();
	}
	return tr;
};

export const createSyncedBlock = ({
	tr,
	syncBlockStore,
	typeAheadInsert,
	fireAnalyticsEvent,
	inputMethod,
}: createSyncedBlockProps): false | Transaction => {
	const {
		schema: {
			nodes: { bodiedSyncBlock, paragraph },
		},
	} = tr.doc.type;

	// Capture createdEmpty before any insertion mutates the selection. The meta is
	// set on the final transaction before returning (see below), since the
	// typeahead path may reassign `tr` and drop meta set here.
	const createdEmpty = tr.selection.empty;

	// If the selection is empty, we want to insert the sync block on a new line
	if (tr.selection.empty) {
		const attrs = syncBlockStore.sourceManager.generateBodiedSyncBlockAttrs();
		const paragraphNode = paragraph.createAndFill({});
		const newBodiedSyncBlockNode = bodiedSyncBlock.createAndFill(
			attrs,
			paragraphNode ? [paragraphNode] : [],
		);

		if (!newBodiedSyncBlockNode) {
			fireAnalyticsEvent?.({
				action: ACTION.ERROR,
				actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
				actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_CREATE,
				attributes: {
					error: 'Create and fill for empty content failed',
				},
				eventType: EVENT_TYPE.OPERATIONAL,
			});
			return false;
		}

		if (typeAheadInsert) {
			tr = typeAheadInsert(newBodiedSyncBlockNode);
		} else {
			tr = safeInsert(newBodiedSyncBlockNode)(tr).scrollIntoView();
			// safeInsert does not move the selection into the new block, so place the
			// caret inside the block's empty paragraph so typing continues inside the
			// synced block (EDITOR-7949).
			if (fg('platform_editor_blocks_patch_4')) {
				tr = placeCaretInsideBodiedSyncBlock(tr, newBodiedSyncBlockNode.attrs.localId);
			}
		}
	} else {
		const conversionInfo = canBeConvertedToSyncBlock(tr.selection);
		if (!conversionInfo) {
			fireAnalyticsEvent?.({
				action: ACTION.ERROR,
				actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
				actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_CREATE,
				attributes: {
					error: 'Content cannot be converted to sync block',
				},
				eventType: EVENT_TYPE.OPERATIONAL,
			});
			return false;
		}

		const attrs = syncBlockStore.sourceManager.generateBodiedSyncBlockAttrs();
		const newBodiedSyncBlockNode = bodiedSyncBlock.createAndFill(
			attrs,
			conversionInfo.contentToInclude,
		);

		if (!newBodiedSyncBlockNode) {
			fireAnalyticsEvent?.({
				action: ACTION.ERROR,
				actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
				actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_CREATE,
				attributes: {
					error: 'Create and fill for content failed',
				},
				eventType: EVENT_TYPE.OPERATIONAL,
			});
			return false;
		}

		tr.replaceWith(conversionInfo.from, conversionInfo.to, newBodiedSyncBlockNode).scrollIntoView();

		if (fg('platform_editor_blocks_patch_4')) {
			// Place the caret on the first editable position inside the converted
			// content so typing continues inside the synced block (EDITOR-7949).
			tr = placeCaretInsideBodiedSyncBlock(tr, newBodiedSyncBlockNode.attrs.localId);
		} else {
			// set selection to the start of the previous selection for the position taken up by the start of the new synced block
			tr.setSelection(TextSelection.create(tr.doc, conversionInfo.from));
		}
	}

	// Stash creation-type signals on the final transaction (after any typeahead
	// reassignment). Set unconditionally — the store manager only reads it behind
	// the feature gate.
	tr.setMeta(creationMetaKey, { createdEmpty, inputMethod });

	return tr;
};

export const copySyncedBlockReferenceToClipboardEditorCommand: (
	syncBlockStore: SyncBlockStoreManager,
	inputMethod: INPUT_METHOD,
	api?: ExtractInjectionAPI<SyncedBlockPlugin>,
) => EditorCommand =
	(
		syncBlockStore: SyncBlockStoreManager,
		inputMethod: INPUT_METHOD,
		api?: ExtractInjectionAPI<SyncedBlockPlugin>,
	) =>
	({ tr }) => {
		if (
			copySyncedBlockReferenceToClipboardInternal(
				tr.doc.type.schema,
				tr.selection,
				syncBlockStore,
				inputMethod,
				api,
			)
		) {
			return tr;
		}

		return null;
	};

export const copySyncedBlockReferenceToClipboard: (
	syncBlockStore: SyncBlockStoreManager,
	inputMethod: INPUT_METHOD,
	api?: ExtractInjectionAPI<SyncedBlockPlugin>,
) => Command =
	(
		syncBlockStore: SyncBlockStoreManager,
		inputMethod: INPUT_METHOD,
		api?: ExtractInjectionAPI<SyncedBlockPlugin>,
	) =>
	(state: EditorState, _dispatch?: CommandDispatch, _view?: EditorView) =>
		copySyncedBlockReferenceToClipboardInternal(
			state.tr.doc.type.schema,
			state.tr.selection,
			syncBlockStore,
			inputMethod,
			api,
		);

const copySyncedBlockReferenceToClipboardInternal = (
	schema: Schema,
	selection: Selection,
	syncBlockStore: SyncBlockStoreManager,
	inputMethod: INPUT_METHOD,
	api?: ExtractInjectionAPI<SyncedBlockPlugin>,
): boolean => {
	const syncBlockFindResult = findSyncBlockOrBodiedSyncBlock(schema, selection);
	if (!syncBlockFindResult) {
		api?.analytics?.actions?.fireAnalyticsEvent({
			eventType: EVENT_TYPE.OPERATIONAL,
			action: ACTION.ERROR,
			actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
			actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_COPY,
			attributes: {
				error: 'No sync block found in selection',
				inputMethod,
			},
		});
		return false;
	}

	const isBodiedSyncBlock = isBodiedSyncBlockNode(
		syncBlockFindResult.node,
		schema.nodes.bodiedSyncBlock,
	);
	let referenceSyncBlockNode: PMNode | null = null;

	if (isBodiedSyncBlock) {
		const {
			nodes: { syncBlock },
		} = schema;

		// create sync block reference node
		referenceSyncBlockNode = syncBlock.createAndFill({
			resourceId: syncBlockStore.referenceManager.generateResourceIdForReference(
				syncBlockFindResult.node.attrs.resourceId,
			),
		});
		if (!referenceSyncBlockNode) {
			api?.analytics?.actions?.fireAnalyticsEvent({
				eventType: EVENT_TYPE.OPERATIONAL,
				action: ACTION.ERROR,
				actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
				actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_COPY,
				attributes: {
					error: 'Failed to create reference sync block node',
					resourceId: syncBlockFindResult.node.attrs.resourceId,
					inputMethod,
				},
			});
			return false;
		}
	} else {
		referenceSyncBlockNode = syncBlockFindResult.node;
	}

	if (!referenceSyncBlockNode) {
		api?.analytics?.actions?.fireAnalyticsEvent({
			eventType: EVENT_TYPE.OPERATIONAL,
			action: ACTION.ERROR,
			actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
			actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_COPY,
			attributes: {
				error: 'No reference sync block node available',
				inputMethod,
			},
		});
		return false;
	}

	const domNode = toDOM(referenceSyncBlockNode, schema);
	copyDomNode(domNode, referenceSyncBlockNode.type, selection);

	// Bare-uuid join key shared with the create/delete events: for a source
	// bodiedSyncBlock its `localId` is the source uuid (copy was page-form only).
	const sourceJoinKey = isBodiedSyncBlock ? syncBlockFindResult.node.attrs.localId : undefined;

	deferDispatch(() => {
		api?.core.actions.execute(({ tr }) => {
			api?.analytics?.actions?.fireAnalyticsEvent({
				eventType: EVENT_TYPE.OPERATIONAL,
				action: ACTION.COPIED,
				actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
				actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_COPY,
				attributes: {
					resourceId: referenceSyncBlockNode.attrs.resourceId,
					inputMethod,
					...(sourceJoinKey &&
						fg('platform_editor_blocks_patch_4') && { blockInstanceId: sourceJoinKey }),
				},
			});

			return tr.setMeta(syncedBlockPluginKey, {
				activeFlag: { id: FLAG_ID.SYNC_BLOCK_COPIED },
			});
		});
	});

	return true;
};

export const editSyncedBlockSource =
	(syncBlockStore: SyncBlockStoreManager, api?: ExtractInjectionAPI<SyncedBlockPlugin>): Command =>
	(state: EditorState, dispatch?: CommandDispatch, _view?: EditorView) => {
		const syncBlock = findSyncBlock(state.schema, state.selection);

		const resourceId = syncBlock?.node?.attrs?.resourceId;
		if (!resourceId) {
			return false;
		}

		const syncBlockURL = syncBlockStore.referenceManager.getSyncBlockURL(resourceId);
		const syncBlockData = syncBlockStore.referenceManager.getFromCache(resourceId)?.data;
		const isOnSameDocument = syncBlockData?.onSameDocument === true;
		const sourceBlock =
			isOnSameDocument && syncBlockData
				? findBodiedSyncBlockByLocalId(state, syncBlockData.blockInstanceId)
				: undefined;

		if (syncBlockURL) {
			api?.analytics?.actions.fireAnalyticsEvent({
				eventType: EVENT_TYPE.OPERATIONAL,
				action: ACTION.SYNCED_BLOCK_EDIT_SOURCE,
				actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
				actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_SOURCE_URL,
				attributes: {
					resourceId: resourceId,
					sameDocument: isOnSameDocument,
				},
			});

			if (sourceBlock) {
				const tr = state.tr
					.setSelection(NodeSelection.create(state.doc, sourceBlock.pos))
					.scrollIntoView();
				dispatch?.(tr);
				return true;
			}

			window.open(syncBlockURL, '_blank');
		} else {
			const { tr } = state;
			api?.analytics?.actions?.attachAnalyticsEvent({
				eventType: EVENT_TYPE.OPERATIONAL,
				action: ACTION.ERROR,
				actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
				actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_SOURCE_URL,
				attributes: {
					error: 'No URL resolved for synced block',
				},
			})(tr);
			dispatch?.(tr);
		}

		return true;
	};

export const removeSyncedBlock =
	(api?: ExtractInjectionAPI<SyncedBlockPlugin>): Command =>
	(state: EditorState, dispatch?: CommandDispatch, _view?: EditorView) => {
		const {
			schema: { nodes },
			tr,
		} = state;

		if (!dispatch) {
			return false;
		}

		let removeTr = tr;
		if (
			findSelectedNodeOfType(nodes.syncBlock)(tr.selection) ||
			findSelectedNodeOfType(nodes.bodiedSyncBlock)(tr.selection)
		) {
			removeTr = removeSelectedNode(tr);
		} else {
			removeTr = removeParentNodeOfType(nodes.bodiedSyncBlock)(tr);
		}

		if (!removeTr) {
			return false;
		}

		// Tag the transaction so analytics can report this as `deleteButton` rather
		// than a keyboard delete (both produce a plain ReplaceStep). Gated so the
		// gate-off transaction is unchanged.
		if (fg('platform_editor_blocks_patch_4')) {
			removeTr.setMeta(deleteMechanismMetaKey, 'deleteButton');
		}

		dispatch(removeTr);
		api?.core.actions.focus();

		return true;
	};

export const removeSyncedBlockAtPos = (
	api: ExtractInjectionAPI<SyncedBlockPlugin> | undefined,
	pos: number,
): void => {
	api?.core.actions.execute(({ tr }) => {
		const node = tr.doc.nodeAt(pos);

		if (node?.type.name === 'syncBlock') {
			return tr.replace(pos, pos + (node?.nodeSize ?? 0));
		}
		return tr;
	});
};
/**
 * Deletes (bodied)SyncBlock node and paste its content to the editor
 */
export const unsync = (
	storeManager: SyncBlockStoreManager,
	isBodiedSyncBlock: boolean,
	view?: EditorView,
): boolean => {
	if (!view) {
		return false;
	}
	const { state } = view;
	const syncBlock = findSyncBlockOrBodiedSyncBlock(state.schema, state.selection);

	if (!syncBlock) {
		return false;
	}

	if (isBodiedSyncBlock) {
		const content = syncBlock?.node.content;
		const { tr } = state;
		tr.replaceWith(syncBlock.pos, syncBlock.pos + syncBlock.node.nodeSize, content).setMeta(
			'deletionReason',
			'source-block-unsynced',
		);
		view.dispatch(tr);

		return true;
	}

	// handle syncBlock unsync
	const syncBlockContent = storeManager.referenceManager.getFromCache(
		syncBlock.node.attrs.resourceId,
	)?.data?.content;
	if (!syncBlockContent) {
		return false;
	}

	// use defaultSchema for serialization so we can serialize any type of nodes and marks despite current editor's schema might not allow it
	const contentFragment = Fragment.fromJSON(defaultSchema, syncBlockContent);
	const contentDOM = DOMSerializer.fromSchema(defaultSchema).serializeFragment(contentFragment);

	return pasteSyncBlockHTMLContent(contentDOM, view);
};
