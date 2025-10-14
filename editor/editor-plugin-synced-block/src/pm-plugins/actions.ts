import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type {
	Command,
	CommandDispatch,
	ExtractInjectionAPI,
	TypeAheadInsert,
} from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { type EditorState, type Transaction } from '@atlaskit/editor-prosemirror/state';
import { safeInsert } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type {
	SyncBlockDataProvider,
	SyncBlockStoreManager,
} from '@atlaskit/editor-synced-block-provider';

import type { SyncedBlockPlugin } from '../syncedBlockPluginType';

import { canBeConvertedToSyncBlock, findSyncBlock } from './utils/utils';

type createSyncedBlockProps = {
	dataProvider?: SyncBlockDataProvider;
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
			nodes: { syncBlock, doc },
		},
	} = tr.doc.type;

	const syncBlockNode = syncBlockStore.createSyncBlockNode();
	const node = syncBlock.createAndFill({ ...syncBlockNode.attrs });

	if (!node) {
		return false;
	}

	// If the selection is empty, we want to insert the sync block on a new line
	if (tr.selection.empty) {
		if (typeAheadInsert) {
			tr = typeAheadInsert(node);
		} else {
			tr = tr.replaceSelectionWith(node).scrollIntoView();
		}
	} else {
		const conversionInfo = canBeConvertedToSyncBlock(tr.selection);
		if (conversionInfo) {
			tr.replaceWith(conversionInfo.from, conversionInfo.to, node).scrollIntoView();
			const innerNodeJson = doc.create({}, conversionInfo.contentToInclude).toJSON();

			// TMP solution to wait for the nested editor view to be set
			// this will be removed once we have a proper architecture settled
			setTimeout(() => {
				const editorView = syncBlockStore.getSyncBlockNestedEditorView();
				if (editorView) {
					const innerTr = editorView.state.tr;
					const innerNode = editorView.state.schema.nodeFromJSON(innerNodeJson);

					editorView.dispatch(innerTr.replaceWith(0, editorView.state.doc.nodeSize - 2, innerNode));
				}
			}, 1000);
		} else {
			// still insert an empty sync block if conversion is not possible
			safeInsert(syncBlock.createAndFill(syncBlockNode.attrs) as PMNode)(tr)?.scrollIntoView();
		}
	}

	return tr;
};

export const copySyncedBlockReferenceToClipboard =
	(api?: ExtractInjectionAPI<SyncedBlockPlugin>): Command =>
	(state: EditorState, dispatch?: CommandDispatch, _view?: EditorView) => {
		if (!api?.floatingToolbar || !dispatch) {
			return false;
		}

		const {
			schema: {
				nodes: { syncBlock },
			},
			tr,
		} = state;
		const newTr = api.floatingToolbar.commands.copyNode(
			syncBlock,
			INPUT_METHOD.FLOATING_TB,
		)({ tr });

		if (!newTr) {
			return false;
		}

		dispatch(newTr);
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
			selection: {
				$from: { pos: from },
				$to: { pos: to },
			},
			tr,
		} = state;

		const syncBlock = findSyncBlock(state);
		if (!syncBlock) {
			return false;
		}

		if (!dispatch) {
			return false;
		}

		const newTr = tr.deleteRange(from, to);
		if (!newTr) {
			return false;
		}

		dispatch(newTr);
		api?.core.actions.focus();
		return true;
	};
