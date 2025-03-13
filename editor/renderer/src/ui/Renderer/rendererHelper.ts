import type { JSONDocNode, JSONNode } from '@atlaskit/editor-json-transformer';

export const removeEmptySpaceAroundContent = (document: JSONDocNode): JSONDocNode => {
	// Check if the document is valid
	if (!document || !document.content || !Array.isArray(document.content)) {
		return document;
	}

	// Check if the node is a meaningful content node meaning it is not an empty paragraph or a paragraph with only whitespace
	const isMeaningfulContentNode = (node: JSONNode): boolean => {
		// Check if the node is a non-empty paragraph or a non-paragraph node
		if (node.type !== 'paragraph') {
			return true;
		}
		// If the paragraph is empty, return false
		if (!node.content || node.content.length === 0) {
			return false;
		}
		// Check if paragraph has any content other than `hardBreak` or whitespace text nodes
		return node.content.some((child) => {
			return !(
				child?.type === 'hardBreak' ||
				(child?.type === 'text' && typeof child.text === 'string' && child.text.trim() === '')
			);
		});
	};

	const content = document.content;
	let firstContentIndex = -1;
	let lastContentIndex = -1;

	// Find the first and last paragraphs with content and check if they are meaningful
	for (let i = 0; i < content.length; i++) {
		if (isMeaningfulContentNode(content[i])) {
			if (firstContentIndex === -1) {
				firstContentIndex = i;
			}
			lastContentIndex = i;
		}
	}

	// If no content was found, return an empty document
	if (firstContentIndex === -1) {
		return { ...document, content: [] };
	}

	// Slice the content array to include only paragraphs between the first and last content
	const trimmedContent = content.slice(firstContentIndex, lastContentIndex + 1);

	// Return a new document with the trimmed content
	return { ...document, content: trimmedContent };
};
