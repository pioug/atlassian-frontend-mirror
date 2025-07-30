import { type ADFEntity } from '@atlaskit/adf-utils/types';
import type { CommandDispatch } from '@atlaskit/editor-common/types';
import { Node } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import { type ReplaceWithAdfResult, SelectionExtensionActionTypes } from '../../types';
import { selectionExtensionPluginKey } from '../main';

export const replaceWithAdf =
	(nodeAdf: ADFEntity) =>
	(state: EditorState, dispatch: CommandDispatch): ReplaceWithAdfResult => {
		const { tr, schema } = state;

		// we need to track if any changes were made since user click the toolbar button
		const docChangedAfterClick =
			selectionExtensionPluginKey.getState(state)?.docChangedAfterClick || false;

		tr.setMeta(selectionExtensionPluginKey, {
			type: SelectionExtensionActionTypes.START_TRACK_CHANGES,
			startTrackChanges: false, // Reset the flag when starting to track changes
		});

		if (docChangedAfterClick) {
			dispatch(tr);
			return { status: 'document-changed' };
		}

		try {
			const selectedNode = selectionExtensionPluginKey.getState(state)?.selectedNode;
			const nodePos = selectionExtensionPluginKey.getState(state)?.nodePos;

			if (!selectedNode || nodePos === undefined) {
				throw new Error('No selected node or node position found');
			}

			const endPos = selectedNode.nodeSize + nodePos;

			const modifiedNode = Node.fromJSON(schema, nodeAdf);
			modifiedNode.check();
			tr.replaceWith(nodePos, endPos, modifiedNode).scrollIntoView();
			dispatch(tr);
			return { status: 'success' };
		} catch (error) {
			dispatch(tr);
			return { status: 'failed-to-replace' };
		}
	};
