import { Fragment } from '@atlaskit/editor-prosemirror/model';

import type { TransformStep } from './types';

export const wrapIntoLayoutStep: TransformStep = (nodes, context) => {
	const { schema } = context;
	const { layoutSection, layoutColumn } = schema.nodes || {};

	const columnOne = layoutColumn.createAndFill({}, Fragment.fromArray(nodes));
	const columnTwo = layoutColumn.createAndFill();

	if (!columnOne || !columnTwo) {
		return nodes;
	}

	const layout = layoutSection.createAndFill({}, Fragment.fromArray([columnOne, columnTwo]));
	if (!layout) {
		return nodes;
	}

	return [layout];
};
