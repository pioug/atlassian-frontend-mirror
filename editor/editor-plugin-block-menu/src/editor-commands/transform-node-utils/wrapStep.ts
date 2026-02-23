import { breakoutResizableNodes } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';

import { removeDisallowedMarks } from './marks';
import type { TransformStep } from './types';
import { convertExpandToNestedExpand } from './utils';

/**
 * Wraps nodes into the target container type.
 * When wrapping into expand, any expand children are converted to nestedExpand
 * since expand cannot be a direct child of expand.
 * 
 * Preserves breakout marks when both source and target nodes support resizing
 * (codeBlock, expand, layoutSection).
 */
export const wrapStep: TransformStep = (nodes, context) => {
	const { schema, targetNodeTypeName, fromNode } = context;

	// When wrapping into expand, convert any expand children to nestedExpand
	// since expand cannot be a direct child of expand
	let processedNodes: PMNode[] = nodes;
	if (targetNodeTypeName === 'expand') {
		processedNodes = nodes.map((node) => {
			if (node.type.name === 'expand') {
				const nestedExpandNode = convertExpandToNestedExpand(node, schema);
				return nestedExpandNode ?? node;
			}
			return node;
		});
	}

	const targetNodeType = schema.nodes[targetNodeTypeName];

	// [FEATURE FLAG: platform_editor_block_menu_expand_localid_fix]
	// Pre-assigns a localId so the localId plugin's appendTransaction does not replace the node
	// object (via setNodeAttribute), which would invalidate the expandedState WeakMap entry set
	// in transformNode.ts and cause the expand to render as collapsed.
	// To clean up: remove the if-else, always use the flag-on branch (isExpandType with uuid).
	const isExpandType = targetNodeTypeName === 'expand' || targetNodeTypeName === 'nestedExpand';
	const nodeAttrs =
		isExpandType && fg('platform_editor_block_menu_expand_localid_fix')
			? { localId: crypto.randomUUID() }
			: {};

	// [FEATURE FLAG: platform_editor_preserve_breakout_on_transform]
	// Preserves breakout mark width when transforming between resizable nodes (codeBlock, expand, layoutSection).
	// This ensures that custom width settings are maintained during block type transformations.
	// To clean up: remove the if-else block and keep only the flag-on behavior (lines 47-58).
	let marks;
	if (fg('platform_editor_preserve_breakout_on_transform')) {
		// NEW BEHAVIOR: Preserve breakout marks when both source and target support resizing
		const sourceSupportsBreakout = breakoutResizableNodes.includes(fromNode.type.name);
		const targetSupportsBreakout = breakoutResizableNodes.includes(targetNodeType.name);
		const shouldPreserveBreakout = sourceSupportsBreakout && targetSupportsBreakout;

		if (shouldPreserveBreakout) {
			const breakoutMark = fromNode.marks.find((mark) => mark.type.name === 'breakout');
			if (breakoutMark) {
				marks = [breakoutMark];
			}
		}
	}
	// else: OLD BEHAVIOR - no breakout mark preservation (to be removed when flag is cleaned up)

	const outputNode = targetNodeType.createAndFill(
		nodeAttrs,
		removeDisallowedMarks(processedNodes, schema.nodes[targetNodeTypeName]),
		marks,
	);

	return outputNode ? [outputNode] : nodes;
};
