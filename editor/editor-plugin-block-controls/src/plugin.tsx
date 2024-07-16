import React from 'react';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

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
		moveNode:
			(start: number, to: number) =>
			({ tr }: { tr: Transaction }) => {
				const node = tr.doc.nodeAt(start);
				const resolvedNode = tr.doc.resolve(start);

				if (!node) {
					return tr;
				}
				const size = node?.nodeSize ?? 1;
				const end = start + size;
				let nodeCopy = tr.doc.content.cut(start, end); // cut the content
				tr.delete(start, end); // delete the content from the original position
				const mappedTo = tr.mapping.map(to);
				tr.insert(mappedTo, nodeCopy); // insert the content at the new position
				tr = selectNode(tr, mappedTo, node.type.name);
				tr.setMeta(key, { nodeMoved: true });
				api?.core.actions.focus();

				api?.analytics?.actions.attachAnalyticsEvent({
					eventType: EVENT_TYPE.TRACK,
					action: ACTION.MOVED,
					actionSubject: ACTION_SUBJECT.ELEMENT,
					actionSubjectId: ACTION_SUBJECT_ID.ELEMENT_DRAG_HANDLE,
					attributes: {
						nodeDepth: resolvedNode.depth,
						nodeType: node.type.name,
					},
				})(tr);

				return tr;
			},
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
