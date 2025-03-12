import type { JSONDocNode, JSONNode } from '@atlaskit/editor-json-transformer';

export const removeEmptySpaceAroundContent = (document: JSONDocNode): JSONDocNode => {
	// Check if the document is valid
	if (!document || !document.content || !Array.isArray(document.content)) {
		return document;
	}

	const isParagraphWithContent = (node: JSONNode): boolean => {
		if (node.type !== 'paragraph' || !node.content || node.content.length === 0) {
			return false;
		}
		// Check if paragraph has any content other than `hardBreak` or whitespace text nodes
		return node.content.some((child) => {
			if (child?.type === 'hardBreak') {
				return false;
			}
			if (child?.type === 'text' && typeof child.text === 'string' && child.text.trim() === '') {
				return false;
			}
			return true;
		});
	};

	const content = document.content;
	let firstContentIndex = -1;
	let lastContentIndex = -1;

	// Find the first and last paragraphs with content
	for (let i = 0; i < content.length; i++) {
		if (isParagraphWithContent(content[i])) {
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
