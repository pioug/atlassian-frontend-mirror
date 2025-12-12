import type { Node as PMNode, NodeType, Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment } from '@atlaskit/editor-prosemirror/model';

import type { TransformStep, NodeTypeName } from '../types';
import { NODE_CATEGORY_BY_TYPE } from '../types';

/**
 * Determines if a node is a text node (heading or paragraph).
 * Text nodes can have their content converted to paragraphs when they can't be wrapped directly.
 */
const isTextNode = (node: PMNode): boolean => {
	const category = NODE_CATEGORY_BY_TYPE[node.type.name as NodeTypeName];
	return category === 'text';
};

/**
 * Converts a text node (heading, paragraph) to a paragraph preserving its inline content.
 * This is used when a text node can't be wrapped directly in the target container
 * (e.g., heading can't go in blockquote, so it becomes a paragraph).
 */
const convertTextNodeToParagraph = (node: PMNode, schema: Schema): PMNode | null => {
	// If it's already a paragraph, return as-is
	if (node.type.name === 'paragraph') {
		return node;
	}
	// Convert heading (or other text node) to paragraph with same inline content
	return schema.nodes.paragraph.createAndFill({}, node.content) ?? null;
};

/**
 * Determines if a node can be wrapped in the target container type.
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
	return targetNodeType.validContent(Fragment.from(node));
};

/**
 * Converts a nestedExpand to a regular expand node.
 * NestedExpands can only exist inside expands, so when breaking out they must be converted.
 */
const convertNestedExpandToExpand = (node: PMNode, schema: Schema): PMNode | null => {
	const expandType = schema.nodes.expand;
	if (!expandType) {
		return null;
	}

	return expandType.createAndFill({ title: node.attrs?.title || '' }, node.content);
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
 */
export const wrapMixedContentStep: TransformStep = (nodes, context) => {
	const { schema, targetNodeTypeName } = context;
	const targetNodeType = schema.nodes[targetNodeTypeName];

	if (!targetNodeType) {
		return nodes;
	}

	const result: PMNode[] = [];
	let currentContainerContent: PMNode[] = [];

	const flushCurrentContainer = () => {
		if (currentContainerContent.length > 0) {
			const containerNode = targetNodeType.createAndFill(
				{},
				Fragment.fromArray(currentContainerContent),
			);
			if (containerNode) {
				result.push(containerNode);
			}
			currentContainerContent = [];
		}
	};

	nodes.forEach((node) => {
		if (canWrapInTarget(node, targetNodeType, targetNodeTypeName)) {
			// Node can be wrapped - add to current container content
			currentContainerContent.push(node);
		} else if (node.type.name === targetNodeTypeName) {
			// Same-type container - breaks out as a separate container (preserved as-is)
			// This handles: "If there's a panel in the expand, it breaks out into a separate panel"
			flushCurrentContainer();
			result.push(node);
		} else if (node.type.name === 'nestedExpand') {
			// NestedExpand can't be wrapped and can't exist outside an expand
			// Convert to regular expand and break out
			flushCurrentContainer();
			const expandNode = convertNestedExpandToExpand(node, schema);
			if (expandNode) {
				result.push(expandNode);
			}
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

	return result.length > 0 ? result : nodes;
};
