import type { Fragment } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

export const getInlineNodeTextContent = (sourceContent: Fragment, tr: Transaction) => {
	let validTransformedContent: string = '';
	const schema = tr.doc.type.schema;
	if (sourceContent.content.length > 1) {
		return;
	}
	// Headings are not valid inside headings so convert heading nodes to paragraphs
	sourceContent.forEach((node) => {
		if (['paragraph', 'heading'].includes(node.type.name)) {
			node.content.forEach((inlineNode) => {
				if (inlineNode.type.name === 'status') {
					validTransformedContent += inlineNode.attrs.text;
				} else {
					validTransformedContent += `${inlineNode.textContent}`;
				}
			});
			validTransformedContent;
		}
	});
	return schema.text(validTransformedContent);
};
