import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { Command, CommandDispatch, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { type EditorState, type Transaction } from '@atlaskit/editor-prosemirror/state';
import { safeInsert } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	createSyncBlockPMNode,
	generateSyncBlockSourceUrl,
} from '@atlaskit/editor-synced-block-provider';

import type { SyncedBlockPlugin } from '../syncedBlockPluginType';

import { findSyncBlock } from './utils/utils';

export const createSyncedBlock = (state: EditorState): Transaction => {
	const {
		tr,
		schema: {
			nodes: { syncBlock },
		},
	} = state;
	const node = createSyncBlockPMNode(syncBlock);
	safeInsert(node)(tr);
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
	(_api?: ExtractInjectionAPI<SyncedBlockPlugin>): Command =>
	(state: EditorState, _dispatch?: CommandDispatch, _view?: EditorView) => {
		const syncBlock = findSyncBlock(state);
		if (!syncBlock) {
			return false;
		}

		const url = generateSyncBlockSourceUrl(syncBlock.node);
		if (!url) {
			return false;
		}

		window.open(url, '_blank');
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
