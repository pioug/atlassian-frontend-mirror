import { transformToContainer } from './container-transforms';
import { transformToList } from './list-transforms';
import type { TransformContext, TransformFunction } from './types';
import { isListNodeType, isContainerNodeType, isBlockNodeType } from './utils';

/**
 * Transform block nodes (paragraph, heading, codeblock)
 */
export const transformBlockNode: TransformFunction = (context: TransformContext) => {
	const { tr, targetNodeType, targetAttrs } = context;
	const { selection } = tr;
	const { $from, $to } = selection;

	// Handle transformation to list types
	if (isListNodeType(targetNodeType)) {
		return transformToList();
	}

	// Handle transformation to container types (panel, expand, blockquote)
	if (isContainerNodeType(targetNodeType)) {
		return transformToContainer();
	}

	// Handle block type transformation (paragraph, heading, codeblock)
	if (isBlockNodeType(targetNodeType)) {
		tr.setBlockType($from.pos, $to.pos, targetNodeType, targetAttrs);
		return tr;
	}

	return null;
};
