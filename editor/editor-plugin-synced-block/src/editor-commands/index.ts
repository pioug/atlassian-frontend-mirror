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
	ExtractInjectionAPI,
	TypeAheadInsert,
} from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { type EditorState, type Transaction } from '@atlaskit/editor-prosemirror/state';
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
		const storeSyncBlockNode = syncBlockStore.createSyncBlockNode();
		const paragraphNode = paragraph.createAndFill({});
		const newBodiedSyncBlockNode = bodiedSyncBlock.createAndFill(
			{ ...storeSyncBlockNode.attrs },
			paragraphNode ? [paragraphNode] : [],
		);

		if (!newBodiedSyncBlockNode) {
			return false;
		}

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
		} else {
			const storeSyncBlockNode = syncBlockStore.createSyncBlockNode();
			const newBodiedSyncBlockNode = bodiedSyncBlock.createAndFill(
				{ ...storeSyncBlockNode.attrs },
				conversionInfo.contentToInclude,
			);

			if (!newBodiedSyncBlockNode) {
				return false;
			}

			tr.replaceWith(
				conversionInfo.from - 1,
				conversionInfo.to,
				newBodiedSyncBlockNode,
			).scrollIntoView();
		}
	}

	return tr;
};

export const copySyncedBlockReferenceToClipboard =
	(api?: ExtractInjectionAPI<SyncedBlockPlugin>): Command =>
	(state: EditorState, _dispatch?: CommandDispatch, _view?: EditorView) => {
		if (!api?.floatingToolbar) {
			return false;
		}

		const syncBlockFindResult = findSyncBlockOrBodiedSyncBlock(state);
		if (!syncBlockFindResult) {
			return false;
		}

		const isBodiedSyncBlock = isBodiedSyncBlockNode(
			syncBlockFindResult.node,
			state.schema.nodes.bodiedSyncBlock,
		);
		let referenceSyncBlockNode: PMNode | null = null;

		if (isBodiedSyncBlock) {
			const {
				schema: {
					nodes: { syncBlock },
				},
			} = state.tr.doc.type;

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

		const domNode = toDOM(referenceSyncBlockNode, state.tr.doc.type.schema);
		copyDomNode(domNode, referenceSyncBlockNode.type, state.tr.selection);

		return true;
	};

export const editSyncedBlockSource =
	(syncBlockStore: SyncBlockStoreManager, api?: ExtractInjectionAPI<SyncedBlockPlugin>): Command =>
	(state: EditorState, dispatch?: CommandDispatch, _view?: EditorView) => {
		const syncBlock = findSyncBlock(state);

		const resourceId = syncBlock?.node?.attrs?.resourceId;
		if (!resourceId) {
			return false;
		}

		const syncBlockURL = syncBlockStore.getSyncBlockURL(resourceId);

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
