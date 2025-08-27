import type { TransformContext, TransformFunction } from './types';
import { isBlockNodeType, isListNodeType, isContainerNodeType } from './utils';

/**
 * Transform selection to container type
 */
export const transformToContainer = () => {
	return null;
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
