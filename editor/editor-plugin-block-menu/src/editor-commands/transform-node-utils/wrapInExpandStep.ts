import { Fragment } from '@atlaskit/editor-prosemirror/model';

import type { TransformStep } from './types';

export const wrapInExpandStep: TransformStep = (nodes, context) => {
	const { schema } = context;
	const { expand } = schema.nodes || {};

	const expandNode = expand.createAndFill({ title: '' }, Fragment.fromArray(nodes));
	if (!expandNode) {
		return nodes;
	}

	return [expandNode];
};
