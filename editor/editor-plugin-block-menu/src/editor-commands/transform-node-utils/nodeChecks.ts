import type { Schema } from '@atlaskit/editor-prosemirror/model';

/**
 * Checks if a node is a list type that supports indentation (bulletList, orderedList, taskList).
 *
 * @param node - The node to check.
 * @param schema - ProseMirror schema for check
 * @returns True if the node is a list type, false otherwise.
 */
export const isListWithIndentation = (nodeTypeName: string, schema: Schema): boolean => {
	const lists = [schema.nodes.taskList, schema.nodes.bulletList, schema.nodes.orderedList];
	return lists.some((list) => list.name === nodeTypeName);
};

/**
 * Checks if a node is a list where its list items only support text content (taskList or decisionList).
 *
 * @param nodeTypeName - The node type name to check.
 * @param schema - ProseMirror schema for check
 * @returns True if the node is a list text type, false otherwise.
 */
export const isListWithTextContentOnly = (nodeTypeName: string, schema: Schema): boolean => {
	const lists = [schema.nodes.taskList, schema.nodes.decisionList];
	return lists.some((list) => list.name === nodeTypeName);
};
