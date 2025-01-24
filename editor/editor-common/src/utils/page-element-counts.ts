import { isNestedTableExtension } from '@atlaskit/adf-utils/transforms';
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
	unexpectedElements: {
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
		unexpectedElements: {},
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
					let extensionKey = node.attrs.extensionKey as string;

					// If there is a nested table extension
					if (isNestedTableExtension(node)) {
						if (
							'parameters' in node.attrs &&
							node.attrs.parameters &&
							'adf' in node.attrs.parameters
						) {
							// Check to see if the ADF contains a nested table
							const adfString = node.attrs.parameters.adf as string;
							const adf = JSON.parse(adfString);
							if (adfString.includes('{"type":"table"')) {
								if (getHasNestedTable(adf)) {
									acc.unexpectedElements['tablesNestedMoreThanOnce'] =
										(acc.unexpectedElements['tablesNestedMoreThanOnce'] ?? 0) + 1;
								}
							}
						}
					}

					// If macros extensionKey has <UUID>/<UUID>/static/ prepended to it, remove the prefix
					if (extensionKey.includes('/static/')) {
						const extensionKeyParts = extensionKey.split('/');
						extensionKey = extensionKeyParts[extensionKeyParts.length - 1];
					}

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

/**
 * Return true is the JSON document contains a table nested within a table
 */
const getHasNestedTable = (node: JSONDocNode): boolean => {
	return reduce(
		node,
		(hasNestedTable, node) => {
			if (hasNestedTable) {
				return hasNestedTable;
			}
			if (node.type === 'table') {
				// The first node that we pass into the reduce function is a table node, and we need to ignore it
				let foundFirstTable = false;
				return reduce(
					node,
					(hasNestedTable, node) => {
						if (hasNestedTable) {
							return hasNestedTable;
						}
						if (node.type === 'table' && foundFirstTable) {
							return true;
						} else if (node.type === 'table') {
							foundFirstTable = true;
						}
						return hasNestedTable;
					},
					false,
				);
			}
			return hasNestedTable;
		},
		false,
	);
};
