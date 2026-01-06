import { type Node as PMNode, type Schema } from '@atlaskit/editor-prosemirror/model';

import { convertNodesToTargetType } from '../transform';
import type { TransformStep, TransformStepContext } from '../types';

/**
 * Handles the edge case where transforming multi-selection to decisionList results in
 * all content breaking out (no valid children for the target). In this case, creates an empty
 * decisionList to ensure the target type exists.
 *
 * Similar to handleEmptyContainerEdgeCase in wrapMixedContentStep, but specifically for
 * multi-to-decisionList transformations where blockquotes break out.
 *
 * @param result - The current result nodes after processing
 * @param hasCreatedDecisionList - Whether a decisionList was already created during processing
 * @param targetNodeTypeName - The target node type name
 * @param schema - The schema
 * @returns The result nodes with an empty decisionList prepended if needed, or the original result
 */
const handleEmptyDecisionListEdgeCase = (
	result: PMNode[],
	hasCreatedDecisionList: boolean,
	targetNodeTypeName: string,
	schema: Schema,
): PMNode[] => {
	// Only apply this edge case for decisionList target
	if (targetNodeTypeName !== 'decisionList') {
		return result;
	}

	// If no decisionList was created but we have nodes in result, all content broke out
	const allContentBrokeOut = !hasCreatedDecisionList && result.length > 0;

	if (!allContentBrokeOut) {
		return result;
	}

	// Create an empty decisionList
	const decisionListType = schema.nodes.decisionList;
	const decisionItemType = schema.nodes.decisionItem;

	if (decisionListType && decisionItemType) {
		const emptyDecisionItem = decisionItemType.createAndFill();
		if (emptyDecisionItem) {
			const emptyDecisionList = decisionListType.createAndFill({}, [emptyDecisionItem]);
			if (emptyDecisionList) {
				return [emptyDecisionList, ...result];
			}
		}
	}

	return result;
};

export const convertEachNodeStep: TransformStep = (
	nodes: PMNode[],
	context: TransformStepContext,
) => {
	const { schema, targetNodeTypeName, targetAttrs } = context;
	const targetNodeType = schema.nodes[targetNodeTypeName];

	if (!targetNodeType) {
		return nodes;
	}

	const blockquoteType = schema.nodes.blockquote;
	const resultNodes: PMNode[] = [];
	let hasCreatedDecisionList = false;

	for (const node of nodes) {
		// Edge case: blockquotes should break out when transforming to decisionList
		if (targetNodeTypeName === 'decisionList' && blockquoteType && node.type === blockquoteType) {
			resultNodes.push(node);
			continue;
		}

		const transformedNodes = convertNodesToTargetType({
			sourceNodes: [node],
			targetNodeType,
			schema,
			isNested: false,
			targetAttrs,
		});

		if (transformedNodes.length > 0) {
			resultNodes.push(...transformedNodes);
			// Track if we created a decisionList

			if (
				targetNodeTypeName === 'decisionList' &&
				transformedNodes.some((n) => n.type === targetNodeType)
			) {
				hasCreatedDecisionList = true;
			}
		} else {
			resultNodes.push(node);
		}
	}

	// Handle edge case: if no decisionList was created, create an empty one
	const finalResult = handleEmptyDecisionListEdgeCase(
		resultNodes,
		hasCreatedDecisionList,
		targetNodeTypeName,
		schema,
	);

	return finalResult;
};
