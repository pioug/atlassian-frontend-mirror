// eslint-disable-next-line import/order
import type { Command } from '@atlaskit/editor-common/types';
import { removeConnectedNodes } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

// eslint-disable-next-line import/order
import { createCommand } from '../plugin-factory';

export const removeDescendantNodes = (sourceNode: PMNode): Command =>
	createCommand(
		{
			type: 'UPDATE_STATE',
			data: { element: undefined },
		},
		(tr, state) => {
			return sourceNode ? removeConnectedNodes(state, sourceNode) : tr;
		},
	);
