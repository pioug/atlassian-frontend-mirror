import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';

export const validNode = (node: PMNode): boolean => {
	try {
		node.check();
	} catch (error) {
		return false;
	}
	return true;
};

/** Validates prosemirror nodes, and returns true only if all nodes are valid */
export const validateNodes = (nodes: PMNode[]): boolean => nodes.every(validNode);
