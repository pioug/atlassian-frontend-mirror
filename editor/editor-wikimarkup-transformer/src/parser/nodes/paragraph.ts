import { type Node as PMNode, type Schema } from '@atlaskit/editor-prosemirror/model';

export function createEmptyParagraphNode(schema: Schema): PMNode {
	const { paragraph } = schema.nodes;

	return paragraph.createChecked({}, []);
}

/**
 * Create paragraphs from inline nodes. Function will return
 * an empty array in case only hardbreaks are present
 */
export function createParagraphNodeFromInlineNodes(
	inlineNodes: PMNode[],
	schema: Schema,
): PMNode[] {
	const { paragraph } = schema.nodes;
	const result = [];
	const textNodes = inlineNodes.filter((node) => node.type.name !== 'hardBreak');
	if (textNodes.length > 0) {
		result.push(paragraph.createChecked({}, inlineNodes));
	}
	return result;
}
