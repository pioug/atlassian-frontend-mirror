import React from 'react';

import { expandSelectionBounds } from '@atlaskit/editor-common/selection';
import {
	TextSelection,
	type EditorState,
	type Transaction,
} from '@atlaskit/editor-prosemirror/state';

import type { BlockControlsPlugin, HandleOptions, MultiSelectDnD } from './blockControlsPluginType';
import { moveNode } from './editor-commands/move-node';
import { moveToLayout } from './editor-commands/move-to-layout';
import { createPlugin, key } from './pm-plugins/main';
import { DragHandleMenu } from './ui/drag-handle-menu';
import { GlobalStylesWrapper } from './ui/global-styles';

export const blockControlsPlugin: BlockControlsPlugin = ({ api }) => ({
	name: 'blockControls',

	pmPlugins() {
		return [
			{
				name: 'blockControlsPmPlugin',
				plugin: ({ getIntl, nodeViewPortalProviderAPI }) =>
					createPlugin(api, getIntl, nodeViewPortalProviderAPI),
			},
		];
	},

	commands: {
		moveNode: moveNode(api),
		moveToLayout: moveToLayout(api),
		showDragHandleAt:
			(pos: number, anchorName: string, nodeType: string, handleOptions?: HandleOptions) =>
			({ tr }: { tr: Transaction }) => {
				const currMeta = tr.getMeta(key);
				tr.setMeta(key, { ...currMeta, activeNode: { pos, anchorName, nodeType, handleOptions } });
				return tr;
			},
		setNodeDragged:
			(getPos: () => number | undefined, anchorName: string, nodeType: string) =>
			({ tr }: { tr: Transaction }) => {
				const pos = getPos();
				if (pos === undefined) {
					return tr;
				}

				const currMeta = tr.getMeta(key);
				tr.setMeta(key, {
					...currMeta,
					isDragging: true,
					activeNode: { pos, anchorName, nodeType },
				});
				return tr;
			},
		setMultiSelectPositions:
			() =>
			({ tr }: { tr: Transaction }) => {
				const { anchor: userAnchor, head: userHead } = tr.selection;
				const { $anchor: expandedAnchor, $head: expandedHead } = expandSelectionBounds(
					tr.selection.$anchor,
					tr.selection.$head,
				);
				api?.selection?.commands.setManualSelection(expandedAnchor.pos, expandedHead.pos)({ tr });
				// this is to normalise the selection's boundaries to inline positions, preventing it from collapsing
				const expandedNormalisedSel = TextSelection.between(expandedAnchor, expandedHead);
				tr.setSelection(expandedNormalisedSel);

				const multiSelectDnD: MultiSelectDnD = {
					anchor: expandedAnchor.pos,
					head: expandedHead.pos,
					textAnchor: expandedNormalisedSel.anchor,
					textHead: expandedNormalisedSel.head,
					userAnchor: userAnchor,
					userHead: userHead,
				};
				const currMeta = tr.getMeta(key);
				tr.setMeta(key, {
					...currMeta,
					multiSelectDnD,
				});
				return tr;
			},
	},

	getSharedState(editorState: EditorState | undefined) {
		if (!editorState) {
			return undefined;
		}
		return {
			isMenuOpen: key.getState(editorState)?.isMenuOpen ?? false,
			activeNode: key.getState(editorState)?.activeNode ?? undefined,
			isDragging: key.getState(editorState)?.isDragging ?? false,
			isPMDragging: key.getState(editorState)?.isPMDragging ?? false,
			multiSelectDnD: key.getState(editorState)?.multiSelectDnD ?? undefined,
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
