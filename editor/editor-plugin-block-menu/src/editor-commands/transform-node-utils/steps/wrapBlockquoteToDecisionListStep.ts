import type { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';

import type { TransformStep, NodeTypeName } from '../types';
import { NODE_CATEGORY_BY_TYPE } from '../types';

/**
 * Determines if a node is a text node (heading or paragraph).
 * Only text nodes should have their inline content extracted for decisionItem.
 * All other nodes should break out.
 */
const isTextNode = (node: PMNode): boolean => {
	const category = NODE_CATEGORY_BY_TYPE[node.type.name as NodeTypeName];
	return category === 'text';
};

/**
 * Creates a decisionItem with the given inline content.
 */
const createDecisionItem = (inlineContent: PMNode['content'], schema: Schema): PMNode | null => {
	const decisionItemType = schema.nodes.decisionItem;

	if (!decisionItemType) {
		return null;
	}

	const canContentBeWrappedInDecisionItem = decisionItemType.validContent(inlineContent);

	// Check if the content is valid for decisionItem
	if (!canContentBeWrappedInDecisionItem) {
		return null;
	}

	return decisionItemType.createAndFill({}, inlineContent);
};

/**
 * Creates a decisionList containing the given decisionItems.
 */
const createDecisionListWithItems = (decisionItems: PMNode[], schema: Schema): PMNode | null => {
	const decisionListType = schema.nodes.decisionList;

	if (!decisionListType || decisionItems.length === 0) {
		return null;
	}

	return decisionListType.createAndFill({}, decisionItems);
};

/**
 * Wraps blockquote content into decisionList:
 * - Text nodes (paragraph, heading) have their inline content extracted and wrapped in decisionItems
 * - Consecutive text nodes are grouped into a single decisionList with multiple decisionItems
 * - All other nodes break out (lists, code blocks, media, tables, macros, containers, etc.)
 *
 * The logic follows the transform rules:
 * - Only flatten text nodes into decisionItem (since that's the intent - converting text to decisions)
 * - Structures that can't be represented in a decisionItem should break out unchanged
 * - When a break-out node is encountered, flush accumulated decisionItems into a decisionList
 *
 * Example: blockquote(p('a'), p('b'), ul(...), p('c')) → [decisionList(decisionItem('a'), decisionItem('b')), ul(...), decisionList(decisionItem('c'))]
 */
export const wrapBlockquoteToDecisionListStep: TransformStep = (nodes, context) => {
	const { schema } = context;
	const decisionItemType = schema.nodes.decisionItem;

	if (!decisionItemType) {
		return nodes;
	}

	const result: PMNode[] = [];
	let currentDecisionItems: PMNode[] = [];

	const flushCurrentDecisionList = () => {
		if (currentDecisionItems.length > 0) {
			const decisionList = createDecisionListWithItems(currentDecisionItems, schema);
			if (decisionList) {
				result.push(decisionList);
			}
			currentDecisionItems = [];
		}
	};

	nodes.forEach((node) => {
		const decisionItem = isTextNode(node) ? createDecisionItem(node.content, schema) : null;
		if (decisionItem) {
			// Accumulate consecutive decisionItems
			currentDecisionItems.push(decisionItem);
		} else {
			// Content can't be wrapped in decisionItem - break out the node
			flushCurrentDecisionList();
			result.push(node);
		}
	});

	// Flush any remaining decisionItems
	flushCurrentDecisionList();

	return result.length > 0 ? result : nodes;
};
