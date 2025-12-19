import type { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';

import { isListWithTextContentOnly } from './nodeChecks';
import type { NodeTypeName, TransformStep } from './types';
import { convertTextNodeToParagraph } from './utils';

const wrapIntoTaskOrDecisionList = (
	nodes: PMNode[],
	targetNodeTypeName: NodeTypeName,
	schema: Schema,
): PMNode[] => {
	const itemNodeType =
		targetNodeTypeName === 'taskList' ? schema.nodes.taskItem : schema.nodes.decisionItem;

	const inlineContent = nodes.flatMap((node) => {
		if (node.isTextblock) {
			return node.children;
		} else if (node.isText) {
			return [node];
		}
		return [];
	});

	const itemNode = itemNodeType.create({}, inlineContent);
	const outputNode = schema.nodes[targetNodeTypeName].createAndFill({}, itemNode);

	return outputNode ? [outputNode] : nodes;
};

const wrapIntoBulletOrOrderedList = (
	nodes: PMNode[],
	targetNodeTypeName: NodeTypeName,
	schema: Schema,
): PMNode[] => {
	const listItemNodes = nodes
		.map((node) =>
			schema.nodes.listItem.createAndFill(
				{},
				node.isTextblock ? convertTextNodeToParagraph(node, schema) : node,
			),
		)
		.filter((node): node is PMNode => node !== null);

	if (listItemNodes.length === 0) {
		return nodes;
	}

	const outputNode = schema.nodes[targetNodeTypeName].createAndFill({}, listItemNodes);
	return outputNode ? [outputNode] : nodes;
};

/**
 * Wraps nodes into bullet list, numbered list, task list, or decision list.
 *
 * @param nodes - The nodes to wrap.
 * @param context - The transformation context containing schema and target node type.
 * @returns The wrapped nodes.
 */
export const wrapIntoListStep: TransformStep = (nodes, context) => {
	const { schema, targetNodeTypeName } = context;

	return isListWithTextContentOnly(targetNodeTypeName, schema)
		? wrapIntoTaskOrDecisionList(nodes, targetNodeTypeName, schema)
		: wrapIntoBulletOrOrderedList(nodes, targetNodeTypeName, schema);
};
