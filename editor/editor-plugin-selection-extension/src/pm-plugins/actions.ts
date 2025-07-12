import { type ADFEntity } from '@atlaskit/adf-utils/types';
import type { CommandDispatch } from '@atlaskit/editor-common/types';
import { type Schema } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

import { SelectionExtensionActionTypes, type LinkInsertionOption } from '../types';

import { selectionExtensionPluginKey } from './main';
import { validateSelectedNode } from './utils';
import { getOffsetByPath, type NodeOffset } from './utils/getOffsetByPath';

const insertLinkTr = (
	tr: Transaction,
	link: string,
	offset: NodeOffset,
	schema: Schema,
): Transaction => {
	const newFromPos = tr.mapping.map(offset.from);
	const newToPos = tr.mapping.map(offset.to || offset.from);

	const smartLink = schema.nodes.inlineCard.createChecked({
		url: link,
	});

	return tr.replaceWith(newFromPos, newToPos, smartLink);
};

export const insertSmartLinks =
	(linkInsertionOption: LinkInsertionOption[], selectedNodeAdf: ADFEntity) =>
	(
		state: EditorState,
		dispatch: CommandDispatch,
	): { status: 'success' | 'error'; message?: string } => {
		const { tr, schema } = state;

		if (linkInsertionOption.length === 0) {
			return { status: 'error', message: 'No link insertion options provided' };
		}

		// we need to track if any changes were made since user click the toolbar button
		// if there is change, we insert the links at the bottom of the page instead
		const docChangedAfterClick =
			selectionExtensionPluginKey.getState(state)?.docChangedAfterClick || false;

		if (docChangedAfterClick) {
			const docEnd = state.doc.content.size;
			linkInsertionOption.forEach((option) => {
				const { link } = option;
				tr.insert(tr.mapping.map(docEnd), schema.nodes.inlineCard.createChecked({ url: link }));
			});

			tr.setMeta(selectionExtensionPluginKey, {
				type: SelectionExtensionActionTypes.START_TRACK_CHANGES,
				startTrackChanges: false, // Reset the flag when starting to track changes
			});
			dispatch(tr);

			return { status: 'success', message: 'Links inserted to page bottom successfully' };
		}

		let newTr = tr;

		try {
			const selectedNode = selectionExtensionPluginKey.getState(state)?.selectedNode;
			const nodePos = selectionExtensionPluginKey.getState(state)?.nodePos;

			if (!selectedNode || nodePos === undefined) {
				throw new Error('No selected node or node position found');
			}

			// Validate if the selectedNodeAdf matches the selected node we have in the state
			if (!validateSelectedNode(selectedNodeAdf, selectedNode)) {
				throw new Error('Selected node ADF does not match the previous stored node');
			}

			linkInsertionOption.forEach((option) => {
				const { link, insertPosition } = option;

				const { pointer, from, to } = insertPosition;

				const offset = getOffsetByPath(selectedNode, nodePos, pointer, from, to) as NodeOffset;
				newTr = insertLinkTr(tr, link, offset, schema);
			});
		} catch (error) {
			return { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' };
		}

		newTr.setMeta(selectionExtensionPluginKey, {
			type: SelectionExtensionActionTypes.START_TRACK_CHANGES,
			startTrackChanges: false, // Reset the flag when starting to track changes
		});

		dispatch(newTr);
		return { status: 'success', message: 'Links inserted successfully' };
	};
