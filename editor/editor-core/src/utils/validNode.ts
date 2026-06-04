import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

export const validNode = (node: PMNode): boolean => {
	try {
		node.check();
	} catch (error) {
		return false;
	}
	return true;
};
