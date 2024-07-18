import { reduce } from '@atlaskit/adf-utils/traverse';
import type { JSONDocNode, JSONNode } from '@atlaskit/editor-json-transformer';

export type PageElementCounts = {
	elements: {
		[key: string]: number;
	};
	textFormats: {
		[key: string]: number;
	};
	macros: {
		[key: string]: number;
	};
};

/**
 * Traverses a JSON document and counts the number of unique elements, text formatting and macros.
 *
 **/
export const getPageElementCounts = (doc: JSONDocNode): PageElementCounts => {
	const pageElementCounts: PageElementCounts = {
		elements: {},
		textFormats: {},
		macros: {},
	};

	reduce(
		doc as JSONDocNode | JSONNode,
		(acc, node) => {
			if (node.type === 'text') {
				if (node.marks) {
					node.marks.forEach((mark) => {
						const markType = mark.type as string;
						acc.textFormats[markType] = (acc.textFormats[markType] ?? 0) + 1;
					});
				}
				acc.elements[node.type] = (acc.elements[node.type] ?? 0) + 1;
			}
			// If the node is a 'macro'or extension
			else if (
				node.type === 'extension' ||
				node.type === 'inlineExtension' ||
				node.type === 'bodiedExtension' ||
				node.type === 'multiBodiedExtension' ||
				node.type === 'extensionFrame'
			) {
				if (
					'attrs' in node &&
					node.attrs &&
					'extensionKey' in node.attrs &&
					node.attrs.extensionKey
				) {
					const extensionKey = node.attrs.extensionKey as string;
					acc.macros[extensionKey] = (acc.macros[extensionKey] ?? 0) + 1;
				}
			} else {
				acc.elements[node.type] = (acc.elements[node.type] ?? 0) + 1;
			}
			return acc;
		},
		pageElementCounts,
	);

	return pageElementCounts;
};
