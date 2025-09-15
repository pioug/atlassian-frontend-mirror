import type { Fragment, Schema, Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { isListNodeType } from './utils';

export const getInlineNodeTextContent = (
	sourceContent: Fragment,
): {
	inlineTextContent: string;
	invalidContent: PMNode[];
} => {
	let validTransformedContent: string = '';
	const invalidContent: PMNode[] = [];

	if (sourceContent.content.length < 1) {
		return { inlineTextContent: '', invalidContent };
	}
	// Headings are not valid inside headings so convert heading nodes to paragraphs
	sourceContent.forEach((node) => {
		if (['paragraph', 'heading', 'taskItem', 'codeBlock'].includes(node.type.name)) {
			node.content.forEach((inlineNode) => {
				if (inlineNode.type.name === 'status') {
					validTransformedContent += inlineNode.attrs.text;
				} else {
					validTransformedContent += `${inlineNode.textContent}`;
				}
			});
		} else if (!isListNodeType(node.type)) {
			invalidContent.push(node);
		}
	});

	return { inlineTextContent: validTransformedContent, invalidContent };
};

export const getInlineNodeTextNode = (sourceContent: Fragment, schema: Schema) => {
	const text = getInlineNodeTextContent(sourceContent).inlineTextContent;
	return schema.text(text);
};
