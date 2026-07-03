import { getDefaultCodeBlockAttrs } from '@atlaskit/editor-common/code-block';
import { breakoutResizableNodes } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import { removeDisallowedMarks } from '../marks';
import type { TransformStep } from '../types';
import { convertExpandToNestedExpand } from '../utils';

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

	const isExpandType = targetNodeTypeName === 'expand' || targetNodeTypeName === 'nestedExpand';
	const isCodeBlock = targetNodeTypeName === 'codeBlock';

	const nodeAttrs = isExpandType
		? { localId: crypto.randomUUID() }
		: isCodeBlock
			? getDefaultCodeBlockAttrs()
			: {};

	// platform_editor_lovability_resize_dividers_panels supports breakout resizing on panels and rules,
	// but rule is NOT a supported transform source/target
	const breakoutResizableNodesList = expValEqualsNoExposure(
		'platform_editor_lovability_resize_dividers_panels',
		'isEnabled',
		true,
	)
		? [...breakoutResizableNodes, 'panel']
		: breakoutResizableNodes;

	const sourceSupportsBreakout = breakoutResizableNodesList.includes(fromNode.type.name);
	const targetSupportsBreakout = breakoutResizableNodesList.includes(targetNodeType.name);
	const shouldPreserveBreakout = sourceSupportsBreakout && targetSupportsBreakout;

	let marks;
	if (shouldPreserveBreakout) {
		const breakoutMark = fromNode.marks.find((mark) => mark.type.name === 'breakout');
		if (breakoutMark) {
			marks = [breakoutMark];
		}
	}

	const outputNode = targetNodeType.createAndFill(
		nodeAttrs,
		removeDisallowedMarks(processedNodes, schema.nodes[targetNodeTypeName]),
		marks,
	);

	return outputNode ? [outputNode] : nodes;
};
