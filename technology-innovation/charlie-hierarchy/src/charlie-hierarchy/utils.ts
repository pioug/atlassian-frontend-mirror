/**
 * Utility functions for Charlie Hierarchy component
 */

import type { HierarchyPointNode } from '@visx/hierarchy/lib/types';

/**
 * Calculates the horizontal shift needed to center nodes when some children are stacked vertically
 * @param totalChildren - Total number of children for a parent node
 * @param stackingThreshold - Maximum number of children to display horizontally
 * @param nodeWidthWithPadding - Width of a node including padding
 * @returns The horizontal offset to apply for centering
 */
export const calculateStackingShift = (
	totalChildren: number,
	stackingThreshold: number,
	nodeWidthWithPadding: number,
): number => {
	const stackedChildren = Math.max(0, totalChildren - stackingThreshold);
	return (stackedChildren * nodeWidthWithPadding) / 2;
};

/**
 * Calculates the adjusted position for a node when stacking is enabled
 * @param originalLeft - The original left position of the node
 * @param parentChildren - Array of parent's children (to get total count)
 * @param stackingThreshold - Maximum number of children to display horizontally
 * @param nodeWidthWithPadding - Width of a node including padding
 * @returns The adjusted left position
 */
export const calculateNodePosition = (
	originalLeft: number,
	parentChildren: unknown[] | undefined,
	stackingThreshold: number,
	nodeWidthWithPadding: number,
): number => {
	if (!parentChildren || parentChildren.length <= stackingThreshold) {
		return originalLeft;
	}

	const stackingShift = calculateStackingShift(
		parentChildren.length,
		stackingThreshold,
		nodeWidthWithPadding,
	);

	return originalLeft + stackingShift;
};

/**
 * Calculates the adjusted x position for a link target when stacking is enabled
 * @param originalX - The original x position of the link target
 * @param sourceChildren - Array of source node's children (to get total count)
 * @param stackingThreshold - Maximum number of children to display horizontally
 * @param nodeWidthWithPadding - Width of a node including padding
 * @returns The adjusted x position
 */
export const calculateLinkTargetPosition = (
	originalX: number,
	sourceChildren: unknown[] | undefined,
	stackingThreshold: number,
	nodeWidthWithPadding: number,
): number => {
	if (!sourceChildren || sourceChildren.length <= stackingThreshold) {
		return originalX;
	}

	const stackingShift = calculateStackingShift(
		sourceChildren.length,
		stackingThreshold,
		nodeWidthWithPadding,
	);

	return originalX + stackingShift;
};

/**
 * Updates the layout position for a single node in a hierarchical tree with stacking support
 * @param index - The index of the current node in the descendants array (0-based)
 * @param stackingThreshold - Maximum number of nodes to display horizontally before stacking
 * @param nodeWidthWithPadding - Width of a node including its padding for spacing calculations
 * @param stackLocations - Mutable array storing positions of horizontal nodes for stacked node reference
 * @param stackingSpacing - Vertical spacing in pixels between stacked nodes
 * @param top - Initial top position of the node (before stacking adjustments)
 * @param left - Initial left position of the node (before centering/stacking adjustments)
 * @param node - The hierarchy node object containing parent/children relationships
 * @returns Object containing the final calculated { top, left } position for the node
 */
export const updateNodeLayout = <Datum>(
	index: number,
	stackingThreshold: number,
	nodeWidthWithPadding: number,
	stackLocations: { top: number; left: number }[],
	stackingSpacing: number,
	top: number,
	left: number,
	node: HierarchyPointNode<Datum>,
) => {
	if (index <= stackingThreshold) {
		if (index > 0) {
			left = calculateNodePosition(
				left,
				node.parent?.children,
				stackingThreshold,
				nodeWidthWithPadding,
			);
		}

		// Add the stack location to the array so we can reference it later
		stackLocations.push({ top: top, left: left });
	} else {
		const stackRefrencePoint = stackLocations[index - stackingThreshold];

		top = stackRefrencePoint.top + stackingSpacing;
		left = stackRefrencePoint.left;

		stackLocations.push({ top: top, left: left });
	}

	return { top, left };
};
