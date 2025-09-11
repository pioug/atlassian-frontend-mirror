import type { Fragment, Schema } from '@atlaskit/editor-prosemirror/model';

export const getInlineNodeTextContent = (sourceContent: Fragment) => {
	let validTransformedContent: string = '';

	if (sourceContent.content.length < 1) {
		return '';
	}
	// Headings are not valid inside headings so convert heading nodes to paragraphs
	sourceContent.forEach((node) => {
		if (['paragraph', 'heading', 'taskItem'].includes(node.type.name)) {
			node.content.forEach((inlineNode) => {
				if (inlineNode.type.name === 'status') {
					validTransformedContent += inlineNode.attrs.text;
				} else {
					validTransformedContent += `${inlineNode.textContent}`;
				}
			});
		}
	});

	return validTransformedContent;
};

export const getInlineNodeTextNode = (sourceContent: Fragment, schema: Schema) => {
	const text = getInlineNodeTextContent(sourceContent);
	return schema.text(text);
};
