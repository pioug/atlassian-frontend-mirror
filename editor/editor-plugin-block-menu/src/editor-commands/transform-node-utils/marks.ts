import type { MarkType, Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';

const removeMarks = (disallowedMarks: MarkType[]) => (node: PMNode) => {
	const filteredMarks = node.marks.filter((mark) => !disallowedMarks.includes(mark.type));
	return node.mark(filteredMarks);
};

export const removeBlockMarks = (nodes: PMNode[], schema: Schema) => {
	const disallowedMarks = [schema.marks.breakout, schema.marks.alignment];
	return nodes.map(removeMarks(disallowedMarks));
};
