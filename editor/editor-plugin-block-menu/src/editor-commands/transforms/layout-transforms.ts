import { DEFAULT_TWO_COLUMN_LAYOUT_COLUMN_WIDTH } from '@atlaskit/editor-common/styles';
import type { TransformContext } from '@atlaskit/editor-common/transforms';
import type { Mark, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Fragment, type Schema } from '@atlaskit/editor-prosemirror/model';

import { convertUnwrappedLayoutContent, unwrapLayoutNodesToTextNodes } from './layout/utils';
import { getMarksWithBreakout, isHeadingOrParagraphNode } from './utils';

export const createDefaultLayoutSection = (
	schema: Schema,
	content: PMNode,
	marks?: readonly Mark[],
): PMNode => {
	const { layoutSection, layoutColumn, paragraph } = schema.nodes;

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

	return layoutSection.createChecked(undefined, layoutContent, marks);
};

export const convertToLayout = (context: TransformContext) => {
	const { tr, sourceNode, sourcePos } = context;
	const content: PMNode = sourceNode.mark(
		sourceNode.marks.filter((mark) => mark.type.name !== 'breakout'),
	);

	// Layout supports breakout mark that can have width attribute
	// When other nodes with breakout (codeBlock and expand) are converted to a layout, the layout should get width of original node
	const marks = getMarksWithBreakout(sourceNode, tr.doc.type.schema.nodes.layoutSection);
	const layoutSectionNode = createDefaultLayoutSection(tr.doc.type.schema, content, marks);

	if (isHeadingOrParagraphNode(sourceNode)) {
		// -1 to fix when sourceNode is the last node in the document, unable to convert to layout
		tr.replaceRangeWith(
			sourcePos > 0 ? sourcePos - 1 : sourcePos,
			sourcePos + sourceNode.nodeSize - 1,
			layoutSectionNode,
		);
	} else {
		tr.replaceRangeWith(sourcePos, sourcePos + sourceNode.nodeSize, layoutSectionNode);
	}

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
