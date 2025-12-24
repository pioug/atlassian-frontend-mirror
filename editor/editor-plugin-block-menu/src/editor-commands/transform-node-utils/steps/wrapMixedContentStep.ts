import type { Node as PMNode, NodeType, Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment } from '@atlaskit/editor-prosemirror/model';

import { removeDisallowedMarks } from '../marks';
import type { TransformStep, NodeTypeName } from '../types';
import { NODE_CATEGORY_BY_TYPE } from '../types';
import { convertTextNodeToParagraph } from '../utils';

/**
 * Determines if a node is a text node (heading or paragraph).
 * Text nodes can have their content converted to paragraphs when they can't be wrapped directly.
 */
const isTextNode = (node: PMNode): boolean => {
	const category = NODE_CATEGORY_BY_TYPE[node.type.name as NodeTypeName];
	return category === 'text';
};

/**
 * Determines if a node can be wrapped in the target container type, removes block marks from the node during check.
 * Uses the schema's validContent to check if the target container can hold this node.
 *
 * Note: What can be wrapped depends on the target container type - for example:
 * - Tables and media CAN go inside expand nodes
 * - Tables CANNOT go inside panels or blockquotes
 */
const canWrapInTarget = (
	node: PMNode,
	targetNodeType: NodeType,
	targetNodeTypeName: NodeTypeName,
): boolean => {
	// Same-type containers should break out as separate containers
	if (node.type.name === targetNodeTypeName) {
		return false;
	}

	// Use the schema to determine if this node can be contained in the target
	return targetNodeType.validContent(Fragment.from(removeDisallowedMarks([node], targetNodeType)));
};

/**
 * Handles the edge case where transforming from a container to another container results in
 * all content breaking out (no valid children for the target). In this case, creates an empty
 * container to ensure the target container type is created.
 *
 * We can determine if there were no valid children by checking if no container was created
 * (`!hasCreatedContainer`) and there are nodes in the result (`result.length > 0`), which
 * means all content broke out rather than being wrapped.
 *
 * @param result - The current result nodes after processing
 * @param hasCreatedContainer - Whether a container was already created during processing
 * @param fromNode - The original source node (before unwrapping)
 * @param targetNodeType - The target container type
 * @param targetNodeTypeName - The target container type name
 * @param schema - The schema
 * @returns The result nodes with an empty container prepended if needed, or the original result
 */
const handleEmptyContainerEdgeCase = (
	result: PMNode[],
	hasCreatedContainer: boolean,
	fromNode: PMNode,
	targetNodeType: NodeType,
	targetNodeTypeName: NodeTypeName,
	schema: Schema,
): PMNode[] => {
	const isFromContainer = NODE_CATEGORY_BY_TYPE[fromNode.type.name as NodeTypeName] === 'container';
	const isTargetContainer = NODE_CATEGORY_BY_TYPE[targetNodeTypeName] === 'container';
	// If no container was created but we have nodes in result, all content broke out
	// (meaning there were no valid children that could be wrapped)
	const allContentBrokeOut = !hasCreatedContainer && result.length > 0;

	const shouldCreateEmptyTarget = isFromContainer && isTargetContainer && allContentBrokeOut;
	if (shouldCreateEmptyTarget) {
		const emptyParagraph = schema.nodes.paragraph.create();
		const emptyContainer = targetNodeType.create({}, emptyParagraph);
		return [emptyContainer, ...result];
	}
	return result;
};

/**
 * A wrap step that handles mixed content according to the Compatibility Matrix:
 * - Wraps consecutive compatible nodes into the target container
 * - Same-type containers break out as separate containers (preserved as-is)
 * - NestedExpands break out as regular expands (converted since nestedExpand can't exist outside expand)
 * - Container structures that can't be nested in target break out (not flattened)
 * - Text/list nodes that can't be wrapped are flattened and merged into the container
 * - Atomic nodes (tables, media, macros) break out
 *
 * What can be wrapped depends on the target container's schema:
 * - expand → panel: tables break out, nestedExpands convert to expands and break out
 * - expand → blockquote: tables/media break out, nestedExpands convert to expands and break out
 * - expand → expand: tables/media stay inside (expands can contain them)
 *
 * Example: expand(p('a'), table(), p('b')) → panel: [panel(p('a')), table(), panel(p('b'))]
 * Example: expand(p('a'), panel(p('x')), p('b')) → panel: [panel(p('a')), panel(p('x')), panel(p('b'))]
 * Example: expand(p('a'), nestedExpand({title: 'inner'})(p('x')), p('b')) → panel: [panel(p('a')), expand({title: 'inner'})(p('x')), panel(p('b'))]
 * Example: expand(nestedExpand()(p())) → panel: [panel(), expand()(p())] (empty panel when all content breaks out)
 */
export const wrapMixedContentStep: TransformStep = (nodes, context) => {
	const { schema, targetNodeTypeName, fromNode } = context;
	const targetNodeType = schema.nodes[targetNodeTypeName];

	if (!targetNodeType) {
		return nodes;
	}

	const result: PMNode[] = [];
	let currentContainerContent: PMNode[] = [];
	let hasCreatedContainer = false;

	const flushCurrentContainer = () => {
		if (currentContainerContent.length > 0) {
			const containerNode = targetNodeType.createAndFill(
				{},
				Fragment.fromArray(currentContainerContent),
			);
			if (containerNode) {
				result.push(containerNode);
				hasCreatedContainer = true;
			}
			currentContainerContent = [];
		}
	};

	nodes.forEach((node) => {
		if (canWrapInTarget(node, targetNodeType, targetNodeTypeName)) {
			// Node can be wrapped - add to current container content
			// remove marks from node as nested nodes don't usually support block marks
			currentContainerContent.push(...removeDisallowedMarks([node], targetNodeType));
		} else if (node.type.name === targetNodeTypeName) {
			// Same-type container - breaks out as a separate container (preserved as-is)
			// This handles: "If there's a panel in the expand, it breaks out into a separate panel"
			flushCurrentContainer();
			result.push(node);
		} else if (isTextNode(node)) {
			// Text node (heading, paragraph) that can't be wrapped - convert to paragraph
			// Example: heading can't go in blockquote, so convert to paragraph with same content
			const paragraph = convertTextNodeToParagraph(node, schema);
			if (paragraph) {
				currentContainerContent.push(paragraph);
			}
		} else {
			// All other nodes that cannot be wrapped (lists, containers, tables, media, macros) - break out
			// This includes list nodes like taskList that can't be placed in certain containers
			flushCurrentContainer();
			result.push(node);
		}
	});

	// Flush any remaining content into a container
	flushCurrentContainer();

	// Handle edge case: create empty container if all content broke out
	const finalResult = handleEmptyContainerEdgeCase(
		result,
		hasCreatedContainer,
		fromNode,
		targetNodeType,
		targetNodeTypeName,
		schema,
	);

	return finalResult.length > 0 ? finalResult : nodes;
};
