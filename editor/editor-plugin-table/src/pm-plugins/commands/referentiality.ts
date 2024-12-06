import { removeConnectedNodes } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { createCommand } from '../plugin-factory';

export const removeDescendantNodes = (sourceNode: PMNode) =>
	createCommand(
		{
			type: 'UPDATE_STATE',
			data: { element: undefined },
		},
		(tr, state) => {
			return sourceNode ? removeConnectedNodes(state, sourceNode) : tr;
		},
	);
