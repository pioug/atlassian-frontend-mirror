import type { Node, NodeType } from '@atlaskit/editor-prosemirror/model';
import { Fragment } from '@atlaskit/editor-prosemirror/model';

import type { TransformContext, TransformFunction } from './types';
import { isBlockNodeType, isListNodeType, isContainerNodeType } from './utils';

const convertInvalidNodeToValidNodeType = (
	sourceContent: Fragment,
	sourceNodeType: NodeType,
	validNodeType: NodeType,
	withMarks?: boolean,
) => {
	const validTransformedContent: Node[] = [];
	// Headings are not valid inside headings so convert heading nodes to paragraphs
	sourceContent.forEach((node) => {
		if (sourceNodeType === node.type) {
			validTransformedContent.push(
				validNodeType.createChecked(node.attrs, node.content, withMarks ? node.marks : undefined),
			);
		} else {
			validTransformedContent.push(node);
		}
	});
	return Fragment.from(validTransformedContent);
};

/**
 * Transform selection to container type
 */
export const transformToContainer = ({
	tr,
	sourceNode,
	targetNodeType,
	targetAttrs,
}: TransformContext) => {
	const selection = tr.selection;
	const schema = tr.doc.type.schema;
	const content = selection.content().content;
	let transformedContent = content;

	if (sourceNode.type === schema.nodes.codeBlock) {
		transformedContent = convertInvalidNodeToValidNodeType(
			transformedContent,
			schema.nodes.codeBlock,
			schema.nodes.paragraph,
		);
	}

	if (targetNodeType === schema.nodes.blockquote) {
		transformedContent = convertInvalidNodeToValidNodeType(
			transformedContent,
			schema.nodes.heading,
			schema.nodes.paragraph,
			true,
		);
	}

	const newNode = targetNodeType.createAndFill(targetAttrs, transformedContent);

	if (!newNode) {
		return null;
	}

	tr.replaceRangeWith(selection.from, selection.to, newNode);

	return tr;
};

/**
 * Transform container nodes (panel, expand, blockquote)
 */
export const transformContainerNode: TransformFunction = ({
	tr,
	sourcePos,
	targetNodeType,
	targetAttrs,
}: TransformContext) => {
	if (sourcePos === null) {
		return null;
	}

	// Transform container to block type - unwrap and convert content
	if (isBlockNodeType(targetNodeType)) {
		return unwrapAndConvertToBlockType();
	}

	// Transform container to list type
	if (isListNodeType(targetNodeType)) {
		return unwrapAndConvertToList();
	}

	// Transform between container types
	if (isContainerNodeType(targetNodeType)) {
		tr.setNodeMarkup(sourcePos, targetNodeType, targetAttrs);
		return tr;
	}

	return null;
};

/**
 * Unwrap container node and convert content to block type
 */
export const unwrapAndConvertToBlockType = () => {
	// Convert to block type directly
	return null;
};

/**
 * Unwrap container node and convert content to list
 */
export const unwrapAndConvertToList = () => {
	// Convert to list directly
	return null;
};
