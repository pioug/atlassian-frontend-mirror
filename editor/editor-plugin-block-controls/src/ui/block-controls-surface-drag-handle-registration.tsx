import React from 'react';

import { BLOCK_CONTROL_UI_CONTEXT } from '@atlaskit/editor-common/block-controls/block-control-ui-context';
import {
	BLOCK_CONTROLS_DRAG_HANDLE,
	BLOCK_CONTROLS_LEFT_GROUP,
} from '@atlaskit/editor-common/block-controls/surface-keys';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterButton } from '@atlaskit/editor-ui-control-model/types';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import { BlockControlsSurfaceDragHandle } from './block-controls-surface-drag-handle';

export const getBlockControlsSurfaceDragHandleComponents = ({
	api,
}: {
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined;
}): RegisterButton[] => [
	{
		component: ({ surfaceContext }) => (
			<BlockControlsSurfaceDragHandle api={api} surfaceContext={surfaceContext} />
		),
		isHidden: ({ surfaceContext } = {}) => {
			const context = surfaceContext?.get(BLOCK_CONTROL_UI_CONTEXT);
			return (
				!context?.activeNode ||
				context.targetNode.pos !== context.activeNode.pos ||
				(context.activeControlKey !== undefined &&
					context.activeControlKey !== BLOCK_CONTROLS_DRAG_HANDLE.key)
			);
		},
		...BLOCK_CONTROLS_DRAG_HANDLE,
		parents: [{ ...BLOCK_CONTROLS_LEFT_GROUP, rank: 200 }],
	},
];
