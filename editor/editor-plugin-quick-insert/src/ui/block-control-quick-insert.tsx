import React from 'react';

import { BLOCK_CONTROL_UI_CONTEXT } from '@atlaskit/editor-common/block-controls/block-control-ui-context';
import { BLOCK_CONTROLS_LEFT_GROUP } from '@atlaskit/editor-common/block-controls/surface-keys';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { RegisterButton } from '@atlaskit/editor-ui-control-model/types';

import type { QuickInsertPlugin } from '../quickInsertPluginType';
import { BlockControlQuickInsertButton } from './BlockControlQuickInsertButton';

export const getBlockControlQuickInsertComponents = ({
	api,
	getEditorView,
	openTypeAhead,
}: {
	api: ExtractInjectionAPI<QuickInsertPlugin>;
	getEditorView: () => EditorView | undefined;
	openTypeAhead: () => void;
}): RegisterButton[] => [
	{
		key: 'block-controls-quick-insert',
		type: 'button',
		parents: [{ ...BLOCK_CONTROLS_LEFT_GROUP, rank: 100 }],
		isHidden: ({ surfaceContext } = {}) => {
			const context = surfaceContext?.get(BLOCK_CONTROL_UI_CONTEXT);
			return (
				api?.editorViewMode?.sharedState.currentState()?.mode === 'view' ||
				!context?.activeNode ||
				context.targetNode.pos !== context.rootNode.pos ||
				context.targetNode.pos !== context.activeNode.rootPos
			);
		},
		component: ({ surfaceContext }) => {
			const context = surfaceContext?.get(BLOCK_CONTROL_UI_CONTEXT);
			const view = getEditorView();

			if (!context || !view) {
				return null;
			}

			return (
				<BlockControlQuickInsertButton
					api={api}
					openTypeAhead={openTypeAhead}
					reserveDragHandleSpace={context.activeNode?.pos !== context.rootNode.pos}
					start={context.targetNode.pos}
					view={view}
				/>
			);
		},
	},
];
