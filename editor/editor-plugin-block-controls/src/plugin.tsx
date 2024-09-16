import React from 'react';

import { type IntlShape } from 'react-intl-next';

import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { moveNode } from './commands/move-node';
import { createEmptyBlockExperimentPlugin } from './pm-plugins/empty-block-experiment';
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
			...(editorExperiment('platform_editor_empty_line_prompt', true, { exposure: true })
				? [
						{
							name: 'emptyBlockExperimentPlugin',
							plugin: ({ getIntl }: { getIntl: () => IntlShape }) =>
								createEmptyBlockExperimentPlugin(api, getIntl),
						},
					]
				: []),
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
