import type { TransformContext, TransformFunction } from './types';
import { isBlockNodeType, isContainerNodeType, isListNodeType } from './utils';

/**
 * Transform selection to list type
 */
export const transformToList = () => {
	return null;
};

/**
 * Transform list nodes
 */
export const transformListNode: TransformFunction = ({ targetNodeType }: TransformContext) => {
	// Transform list to block type
	if (isBlockNodeType(targetNodeType)) {
		// Lift list items out of the list and convert to target block type
		return null;
	}

	// Transform list to container type
	if (isContainerNodeType(targetNodeType)) {
		// Lift list items out of the list and convert to container type
		return null;
	}

	// Transform between list types
	if (isListNodeType(targetNodeType)) {
		// Lift list items out of the list and convert to the other list type
		return null;
	}

	return null;
};

/**
 * Lift list content and convert to block type
 */
export const liftListToBlockType = () => {
	// Convert to target block type directly
	return null;
};

/**
 * Transform between different list types
 */
export const transformBetweenListTypes = () => {
	return null;
};
