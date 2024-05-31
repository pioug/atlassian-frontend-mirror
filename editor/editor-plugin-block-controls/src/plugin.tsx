import React from 'react';

import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

import { createPlugin, key } from './pm-plugins/main';
import { DragHandleMenu } from './ui/drag-handle-menu';
import { GlobalStylesWrapper } from './ui/global-styles';
import { getSelection } from './utils/getSelection';

export const blockControlsPlugin: NextEditorPlugin<'blockControls'> = ({ api }) => ({
	name: 'blockControls',

	pmPlugins() {
		return [
			{
				name: 'blockControlsPmPlugin',
				plugin: () => createPlugin(api),
			},
		];
	},

	commands: {
		moveNode:
			(start: number, to: number) =>
			({ tr }: { tr: Transaction }) => {
				const node = tr.doc.nodeAt(start);
				const size = node?.nodeSize ?? 1;
				const end = start + size;
				let nodeCopy = tr.doc.content.cut(start, end); // cut the content
				tr.delete(start, end); // delete the content from the original position
				const mappedTo = tr.mapping.map(to);
				tr.insert(mappedTo, nodeCopy); // insert the content at the new position
				tr.setSelection(getSelection(tr, mappedTo));
				api?.core.actions.focus();

				return tr;
			},
	},

	getSharedState(editorState: EditorState) {
		if (!editorState) {
			return undefined;
		}
		return {
			isMenuOpen: key.getState(editorState)?.isMenuOpen ?? false,
			activeNode: key.getState(editorState)?.activeNode ?? null,
			decorationState: key.getState(editorState)?.decorationState ?? [],
			isDragging: key.getState(editorState)?.isDragging ?? false,
		};
	},

	contentComponent() {
		return (
			<>
				<DragHandleMenu api={api} />
				<GlobalStylesWrapper />
			</>
		);
	},
});
