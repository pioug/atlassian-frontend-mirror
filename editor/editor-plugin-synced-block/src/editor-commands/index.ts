import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
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
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer, Fragment, type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import {
	type EditorState,
	type Transaction,
	TextSelection,
	type Selection,
} from '@atlaskit/editor-prosemirror/state';
import {
	findSelectedNodeOfType,
	removeParentNodeOfType,
	removeSelectedNode,
	safeInsert,
} from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';

import { syncedBlockPluginKey } from '../pm-plugins/main';
import {
	canBeConvertedToSyncBlock,
	deferDispatch,
	findSyncBlock,
	findSyncBlockOrBodiedSyncBlock,
	isBodiedSyncBlockNode,
} from '../pm-plugins/utils/utils';
import type { SyncedBlockPlugin } from '../syncedBlockPluginType';
import { FLAG_ID } from '../types';

import { pasteSyncBlockHTMLContent } from './utils';

type createSyncedBlockProps = {
	fireAnalyticsEvent?: DispatchAnalyticsEvent;
	syncBlockStore: SyncBlockStoreManager;
	tr: Transaction;
	typeAheadInsert?: TypeAheadInsert;
};

export const createSyncedBlock = ({
	tr,
	syncBlockStore,
	typeAheadInsert,
	fireAnalyticsEvent,
}: createSyncedBlockProps): false | Transaction => {
	const {
		schema: {
			nodes: { bodiedSyncBlock, paragraph },
		},
	} = tr.doc.type;

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

		// set selection to the start of the previous selection for the position taken up by the start of the new synced block
		tr.setSelection(TextSelection.create(tr.doc, conversionInfo.from));
	}

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
	(state: EditorState, _dispatch?: CommandDispatch, _view?: EditorView) => copySyncedBlockReferenceToClipboardInternal(
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

		if (syncBlockURL) {
			api?.analytics?.actions.fireAnalyticsEvent({
				eventType: EVENT_TYPE.OPERATIONAL,
				action: ACTION.SYNCED_BLOCK_EDIT_SOURCE,
				actionSubject: ACTION_SUBJECT.SYNCED_BLOCK,
				actionSubjectId: ACTION_SUBJECT_ID.SYNCED_BLOCK_SOURCE_URL,
				attributes: {
					resourceId: resourceId,
				},
			});

			window.open(syncBlockURL, '_blank');
		} else {
			const {tr} = state;
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

		dispatch(removeTr);
		api?.core.actions.focus();

		return true;
	};

export const removeSyncedBlockAtPos = (
	api: ExtractInjectionAPI<SyncedBlockPlugin> | undefined,
	pos: number,
) => {
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
) => {
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
		const {tr} = state;
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
