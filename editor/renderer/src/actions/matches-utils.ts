import type { Node, Schema } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags/fg';

/** Returns whether renderer annotations should use node-mark steps for this node. */
export function isBlockAnnotationTarget(node: Node, schema: Schema): boolean {
	const { extension, media } = schema.nodes;

	return (
		node.type === media ||
		(node.type === extension &&
			fg('cc_maui_annotations_on_extensions') &&
			node.type.allowsMarkType(schema.marks.annotation))
	);
}

// Finds a string position using the Confluence annotation backend's serialisation rules.
export function getIndexMatch(
	doc: Node,
	schema: Schema,
	selectedText: string,
	startIndex: number,
): {
	blockNodePos?: number;
	matchIndex: number;
	numMatches: number;
	textContent: string;
} {
	let textContent = '';
	let matchIndex = 0;
	let numMatches = 0;
	let blockNodePos: number | undefined;

	doc.descendants((node: Node, pos: number) => {
		const nodeType = node.type;
		const isBlockTarget = isBlockAnnotationTarget(node, schema);

		const isBlockContainer = nodeType.isBlock && !nodeType.isLeaf && !nodeType.inlineContent;

		// Containers may allow annotations for their children; skip their own text to avoid double-counting.
		if (
			(node.isText || !nodeType.allowsMarkType(schema.marks.annotation) || isBlockContainer) &&
			!isBlockTarget
		) {
			return true;
		}

		const nodeStart = pos;
		const nodeEnd = nodeStart + node.nodeSize;

		if (startIndex >= nodeStart && startIndex <= nodeEnd) {
			if (isBlockTarget) {
				blockNodePos = pos;
			}
			// If the start of the annotation selection is within the current node, we scan the document for previous occurrences
			// Find the index by counting all previous instances of the selectedText in the partial textContent
			// Need to scan from start, up to `startIndex` (which includes partial of the current node)
			textContent += doc.textBetween(nodeStart, startIndex - 1);
			matchIndex = countMatches(textContent, selectedText);

			// Complete appending of the node
			textContent += doc.textBetween(startIndex, nodeEnd);
		} else {
			textContent += node.textContent;
		}

		return true;
	});

	// Count total number of matches in final text
	numMatches = countMatches(textContent, selectedText);

	return { numMatches, matchIndex, textContent, blockNodePos };
}

// countMatches finds the total number of occurrences of `query` within a given `searchString`
export function countMatches(searchString: string, query: string): number {
	if (searchString === '' || query === '') {
		return 0;
	}
	// Escape characters that would trigger as syntax in a regex query before converting to the query
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	const reg = new RegExp(query.replace(/(?=[.\\+*?[^\]$(){}\|])/g, '\\'), 'g');
	return (searchString.match(reg) || []).length;
}
