import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';

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

	if (fg('platform_editor_controls_patch_8')) {
		// Check if there are multiple parts with formatting or if only one part has formatting and the rest have none
		const contentWithMarks = selectedContent.filter((child) => isMarkInIconTypes(child));
		const hasFormatting = contentWithMarks.length > 0;
		const allPartsHaveFormatting = contentWithMarks.length === selectedContent.length;

		return hasFormatting && (!allPartsHaveFormatting || contentWithMarks.length > 1);
	}

	const marks = selectedContent
		.map((child) => (isMarkInIconTypes(child) ? child.marks : undefined))
		.filter(Boolean);

	return marks.length > 1;
};
