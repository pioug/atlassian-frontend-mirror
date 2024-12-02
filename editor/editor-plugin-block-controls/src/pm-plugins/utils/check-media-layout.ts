import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';

export const isWrappedMedia = (node?: PMNode) => {
	if ('mediaSingle' === node?.type.name) {
		if (['wrap-right', 'wrap-left'].includes(node.attrs.layout)) {
			return true;
		}
	}
	return false;
};
