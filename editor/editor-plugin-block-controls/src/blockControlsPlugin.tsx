import React from 'react';

import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';

import type { BlockControlsPlugin, HandleOptions } from './blockControlsPluginType';
import { moveNode } from './editor-commands/move-node';
import { moveToLayout } from './editor-commands/move-to-layout';
import { createPlugin, key } from './pm-plugins/main';
import { selectNode } from './pm-plugins/utils';
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
				tr.setMeta(key, { activeNode: { pos, anchorName, nodeType, handleOptions } });
				return tr;
			},
		setNodeDragged:
			(getPos: () => number | undefined, anchorName: string, nodeType: string) =>
			({ tr }: { tr: Transaction }) => {
				const pos = getPos();
				if (pos === undefined) {
					return tr;
				}

				if (!fg('platform_editor_element_drag_and_drop_ed_24885')) {
					tr = selectNode(tr, pos, nodeType);
				}

				tr.setMeta(key, {
					isDragging: true,
					activeNode: { pos, anchorName, nodeType },
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
