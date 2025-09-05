import { transformToContainer, unwrapAndConvertToBlockType } from './container-transforms';
import { getInlineNodeTextContent } from './inline-node-transforms';
import { transformBlockToList } from './list-transforms';
import type { TransformContext, TransformFunction } from './types';
import { isListNodeType, isContainerNodeType, isBlockNodeType } from './utils';

/**
 * Transform block nodes (paragraph, heading, codeblock)
 */
export const transformBlockNode: TransformFunction = (context: TransformContext) => {
	const { targetNodeType } = context;

	// Handle transformation to list types
	if (isListNodeType(targetNodeType)) {
		return transformBlockToList(context);
	}

	// Handle transformation to container types (panel, expand, blockquote)
	if (isContainerNodeType(targetNodeType)) {
		return transformToContainer(context);
	}

	// Handle block type transformation (paragraph, heading, codeblock)
	if (isBlockNodeType(targetNodeType)) {
		return transformToBlockNode(context);
	}

	return null;
};

const transformToBlockNode = (context: TransformContext) => {
	const { tr, targetNodeType, targetAttrs, sourceNode } = context;
	const { selection, doc } = tr;
	const { $from, $to } = selection;
	const schema = doc.type.schema;

	if (targetNodeType === schema.nodes.codeBlock) {
		const textContent = getInlineNodeTextContent(selection.content().content, tr);
		const node = schema.nodes.codeBlock.createChecked(undefined, textContent);
		return tr.replaceRangeWith(selection.from, selection.to, node);
	}

	// code block acts like a container, we need to unwrap it
	if (sourceNode.type === schema.nodes.codeBlock) {
		return unwrapAndConvertToBlockType(context);
	}

	tr.setBlockType($from.pos, $to.pos, targetNodeType, targetAttrs);
	return tr;
};
