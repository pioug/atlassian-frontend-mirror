import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { IconTypes } from './types';

const isMarkInIconTypes = (node: PMNode) =>
	node.marks.some((mark) => Object.values(IconTypes).includes(mark.type.name as IconTypes));

export const hasMultiplePartsWithFormattingInSelection = ({
	selectedContent,
}: {
	selectedContent?: PMNode[];
}) => {
	if (!selectedContent) {
		return false;
	}
	const marks = selectedContent
		.map((child) => (isMarkInIconTypes(child) ? child.marks : undefined))
		.filter(Boolean);

	return marks.length > 1;
};
