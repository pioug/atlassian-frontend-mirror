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

	// Check if there are multiple parts with formatting or if only one part has formatting and the rest have none
	const contentWithMarks = selectedContent.filter((child) => isMarkInIconTypes(child));
	const hasFormatting = contentWithMarks.length > 0;
	const allPartsHaveFormatting = contentWithMarks.length === selectedContent.length;

	return hasFormatting && (!allPartsHaveFormatting || contentWithMarks.length > 1);
};

// Clean up when platform_editor_common_marks is removed
export const getCommonActiveMarks = ({ selectedContent }: { selectedContent?: PMNode[] }) => {
	if (!selectedContent || selectedContent.length === 0) {
		return [];
	}
	// filter out fragment node contains only spaces
	const filteredSelectedContent = selectedContent.filter((child) => child.text?.trim() !== '');
	// find the active mark type in first part
	const firstPartMarks = selectedContent[0].marks.map((mark) => mark.type.name);
	// check if all other parts have the same mark type as the first part and return the common mark types
	const commonMarkTypes = firstPartMarks.filter((mark) =>
		filteredSelectedContent.every((child) => child.marks.some((m) => m.type.name === mark)),
	);
	return commonMarkTypes;
};
