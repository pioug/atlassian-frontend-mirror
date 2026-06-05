import type { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';

/**
 * Convert a block node to inline content suitable for task items
 */
export const convertBlockToInlineContent = (node: PMNode, schema: Schema): PMNode[] => {
	const { paragraph, hardBreak } = schema.nodes;

	if (node.type === paragraph) {
		return [...node.content.content];
	}

	if (node.isBlock) {
		const textContent = node.textContent;
		const lines = textContent.split('\n');
		const newText: PMNode[] = [];
		lines.forEach((line, index) => {
			if (line !== '') {
				newText.push(line ? schema.text(line) : schema.text(' '));
			}
			if (lines.length > 1 && index !== lines.length - 1) {
				newText.push(hardBreak.create());
			}
		});
		return newText;
	}

	return [node];
};
