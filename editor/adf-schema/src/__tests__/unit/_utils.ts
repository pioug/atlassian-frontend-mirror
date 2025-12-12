import type { NodeSpec } from '@atlaskit/editor-prosemirror/model';

/**
 * Normalize the node spec by sorting the marks
 * @param node nodeSpec
 * @returns
 */
export const normalizeNodeSpec = (node: NodeSpec) => {
	return {
		...node,
		...(node.marks && {
			marks: node.marks.split(' ').sort().join(' '),
		}),
	};
};
