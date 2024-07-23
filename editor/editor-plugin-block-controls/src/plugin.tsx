import React from 'react';

import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

import { moveNode } from './commands/move-node';
import { createPlugin, key } from './pm-plugins/main';
import type { BlockControlsPlugin, HandleOptions } from './types';
import { DragHandleMenu } from './ui/drag-handle-menu';
import { GlobalStylesWrapper } from './ui/global-styles';
import { selectNode } from './utils';

export const blockControlsPlugin: BlockControlsPlugin = ({ api }) => ({
	name: 'blockControls',

	pmPlugins() {
		return [
			{
				name: 'blockControlsPmPlugin',
				plugin: ({ getIntl }) => createPlugin(api, getIntl),
			},
		];
	},

	commands: {
		moveNode: moveNode(api),
		showDragHandleAt:
			(pos: number, anchorName: string, nodeType: string, handleOptions?: HandleOptions) =>
			({ tr }: { tr: Transaction }) => {
				tr.setMeta(key, { activeNode: { pos, anchorName, nodeType, handleOptions } });
				return tr;
			},
		setNodeDragged:
			(pos: number, anchorName: string, nodeType: string) =>
			({ tr }: { tr: Transaction }) => {
				if (pos === undefined) {
					return tr;
				}

				let newTr = tr;
				newTr = selectNode(newTr, pos, nodeType);
				newTr.setMeta(key, {
					isDragging: true,
					activeNode: { pos, anchorName, nodeType },
				});
				return newTr;
			},
	},

	getSharedState(editorState: EditorState | undefined) {
		if (!editorState) {
			return undefined;
		}
		return {
			isMenuOpen: key.getState(editorState)?.isMenuOpen ?? false,
			activeNode: key.getState(editorState)?.activeNode ?? null,
			decorationState: key.getState(editorState)?.decorationState ?? [],
			isDragging: key.getState(editorState)?.isDragging ?? false,
			isPMDragging: key.getState(editorState)?.isPMDragging ?? false,
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
