import React from 'react';

import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { createPlugin, key } from './pm-plugins/main';
import type { BlockControlsPlugin } from './types';
import { DragHandleMenu } from './ui/drag-handle-menu';
import { GlobalStylesWrapper } from './ui/global-styles';
import { getSelection } from './utils/getSelection';

export const blockControlsPlugin: BlockControlsPlugin = ({ api }) => ({
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
				tr.setMeta(key, { nodeMoved: true });
				api?.core.actions.focus();

				return tr;
			},
		showDragHandleAt:
			(pos: number, anchorName: string, nodeType: string) =>
			({ tr }: { tr: Transaction }) => {
				tr.setMeta(key, { activeNode: { pos, anchorName, nodeType } });
				return tr;
			},
		setNodeDragged:
			(pos: number, anchorName: string) =>
			({ tr }: { tr: Transaction }) => {
				const newTr = tr;
				if (pos === undefined) {
					return tr;
				}
				newTr.setSelection(getSelection(newTr, pos));
				newTr.setMeta(key, {
					isDragging: true,
					activeNode: { pos, anchorName },
				});
				return newTr;
			},
	},

	getSharedState(editorState) {
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
