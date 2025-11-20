import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
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
import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
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
} from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';

import {
	canBeConvertedToSyncBlock,
	findSyncBlock,
	findSyncBlockOrBodiedSyncBlock,
	isBodiedSyncBlockNode,
} from '../pm-plugins/utils/utils';
import type { SyncedBlockPlugin } from '../syncedBlockPluginType';

type createSyncedBlockProps = {
	syncBlockStore: SyncBlockStoreManager;
	tr: Transaction;
	typeAheadInsert?: TypeAheadInsert;
};

export const createSyncedBlock = ({
	tr,
	syncBlockStore,
	typeAheadInsert,
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
			return false;
		}

		// Save the new node with empty content to backend
		// This is so that the node can be copied and referenced without the source being saved/published
		syncBlockStore.sourceManager.createBodiedSyncBlockNode(attrs);

		if (typeAheadInsert) {
			tr = typeAheadInsert(newBodiedSyncBlockNode);
		} else {
			tr = tr.replaceSelectionWith(newBodiedSyncBlockNode).scrollIntoView();
		}
	} else {
		const conversionInfo = canBeConvertedToSyncBlock(tr.selection);
		if (!conversionInfo) {
			// TODO: EDITOR-1665 - Raise an error analytics event
			return false;
		}

		const attrs = syncBlockStore.sourceManager.generateBodiedSyncBlockAttrs();
		const newBodiedSyncBlockNode = bodiedSyncBlock.createAndFill(
			attrs,
			conversionInfo.contentToInclude,
		);

		if (!newBodiedSyncBlockNode) {
			return false;
		}

		// Save the new node with empty content to backend
		// This is so that the node can be copied and referenced without the source being saved/published
		syncBlockStore.sourceManager.createBodiedSyncBlockNode(attrs);

		tr.replaceWith(
			conversionInfo.from > 0 ? conversionInfo.from - 1 : 0,
			conversionInfo.to,
			newBodiedSyncBlockNode,
		).scrollIntoView();

		// set selection to the end of the previous selection + 1 for the position taken up by the start of the new synced block
		tr.setSelection(TextSelection.create(tr.doc, conversionInfo.to + 1));
	}

	// This transaction will be intercepted in filterTransaction and dispatched when saving to backend succeeds
	// see filterTransaction for more details
	return tr;
};

export const copySyncedBlockReferenceToClipboardEditorCommand: EditorCommand = ({ tr }) => {
	if (copySyncedBlockReferenceToClipboardInternal(tr.doc.type.schema, tr.selection)) {
		return tr;
	}

	return null;
};

export const copySyncedBlockReferenceToClipboard: Command = (
	state: EditorState,
	_dispatch?: CommandDispatch,
	_view?: EditorView,
) => {
	return copySyncedBlockReferenceToClipboardInternal(state.tr.doc.type.schema, state.tr.selection);
};

const copySyncedBlockReferenceToClipboardInternal = (
	schema: Schema,
	selection: Selection,
): boolean => {
	const syncBlockFindResult = findSyncBlockOrBodiedSyncBlock(schema, selection);
	if (!syncBlockFindResult) {
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
			resourceId: syncBlockFindResult.node.attrs.resourceId,
		});
		if (!referenceSyncBlockNode) {
			return false;
		}
	} else {
		referenceSyncBlockNode = syncBlockFindResult.node;
	}

	if (!referenceSyncBlockNode) {
		return false;
	}

	const domNode = toDOM(referenceSyncBlockNode, schema);
	copyDomNode(domNode, referenceSyncBlockNode.type, selection);

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
			window.open(syncBlockURL, '_blank');
		} else {
			const tr = state.tr;
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
