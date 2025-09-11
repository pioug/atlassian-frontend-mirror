import { DEFAULT_TWO_COLUMN_LAYOUT_COLUMN_WIDTH } from '@atlaskit/editor-common/styles';
import type { TransformContext } from '@atlaskit/editor-common/transforms';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Fragment } from '@atlaskit/editor-prosemirror/model';

import { convertUnwrappedLayoutContent, unwrapLayoutNodesToTextNodes } from './layout/utils';

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
	tr.replaceRangeWith(sourcePos, sourcePos + sourceNode.nodeSize, layoutSectionNode);

	return tr;
};

export const transformLayoutNode = (context: TransformContext) => {
	const { tr, sourceNode, targetNodeType, sourcePos, targetAttrs } = context;
	const schema = tr.doc.type.schema || {};
	const { layoutSection, layoutColumn, paragraph, heading } = schema.nodes || {};
	const layoutColumnNodes: PMNode[] = [];

	const targetTextNodeType = targetNodeType === heading ? heading : paragraph;

	sourceNode.children.forEach((child) => {
		if (child.type === layoutColumn) {
			const unwrappedContent: PMNode[] = [];
			child.content.forEach((node) => {
				// Unwrap all nodes and convert to text nodes
				const context = {
					tr,
					sourceNode: node,
					targetNodeType: targetTextNodeType,
					sourcePos: 0,
					targetAttrs,
				};
				const newContent = unwrapLayoutNodesToTextNodes(context, targetNodeType);
				unwrappedContent.push(...newContent);
			});
			const newColumnContent = convertUnwrappedLayoutContent(
				unwrappedContent,
				targetNodeType,
				schema,
				targetAttrs,
			);

			layoutColumnNodes.push(
				layoutColumn.createChecked(child.attrs, Fragment.fromArray(newColumnContent), child.marks),
			);
		}
	});

	return tr.replaceRangeWith(
		sourcePos,
		sourcePos + sourceNode.nodeSize,
		layoutSection.createChecked(
			sourceNode.attrs,
			Fragment.fromArray(layoutColumnNodes),
			sourceNode.marks,
		),
	);
};
