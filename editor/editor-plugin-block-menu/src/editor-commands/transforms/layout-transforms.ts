import { DEFAULT_TWO_COLUMN_LAYOUT_COLUMN_WIDTH } from '@atlaskit/editor-common/styles';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Fragment } from '@atlaskit/editor-prosemirror/model';

import type { TransformContext } from './types';

export const convertToLayout = (context: TransformContext) => {
	const { tr, sourceNode, sourcePos } = context;
	const { layoutSection, layoutColumn, paragraph } = tr.doc.type.schema.nodes || {};
	const content: PMNode = sourceNode.mark(
		sourceNode.marks.filter((mark) => mark.type.name !== 'breakout'),
	);

	const layoutContent = Fragment.fromArray([
		layoutColumn.createChecked(
			{
				width: DEFAULT_TWO_COLUMN_LAYOUT_COLUMN_WIDTH,
			},
			content,
		),
		layoutColumn.create(
			{
				width: DEFAULT_TWO_COLUMN_LAYOUT_COLUMN_WIDTH,
			},
			paragraph.createAndFill(),
		),
	]);

	const layoutSectionNode = layoutSection.createChecked(undefined, layoutContent);

	// Replace the original node with the new layout node
	tr.replaceRangeWith(sourcePos || 0, (sourcePos || 0) + sourceNode.nodeSize, layoutSectionNode);

	return tr;
};
