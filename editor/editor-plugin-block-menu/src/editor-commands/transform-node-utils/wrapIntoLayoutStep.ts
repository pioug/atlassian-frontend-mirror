import { removeBlockMarks } from './marks';
import type { TransformStep } from './types';

export const wrapIntoLayoutStep: TransformStep = (nodes, context) => {
	const { schema } = context;
	const { layoutSection, layoutColumn } = schema.nodes || {};

	const columnOne = layoutColumn.createAndFill({}, removeBlockMarks(nodes, schema));
	const columnTwo = layoutColumn.createAndFill();

	if (!columnOne || !columnTwo) {
		return nodes;
	}

	const layout = layoutSection.createAndFill({}, [columnOne, columnTwo]);

	return layout ? [layout] : nodes;
};
