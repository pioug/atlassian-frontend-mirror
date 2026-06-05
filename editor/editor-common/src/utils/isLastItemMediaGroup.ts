import type { Node } from '@atlaskit/editor-prosemirror/model';

export const isLastItemMediaGroup = (node: Node): boolean => {
	const { content } = node;
	return !!content.lastChild && content.lastChild.type.name === 'mediaGroup';
};
