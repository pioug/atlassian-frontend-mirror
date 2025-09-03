import { transformNestedTableNodeOutgoingDocument } from '@atlaskit/adf-utils/transforms';
import { traverse } from '@atlaskit/adf-utils/traverse';
import { type ADFEntity } from '@atlaskit/adf-utils/types';

import { type JSONNode } from '../types';

import { removeMarks, removeNonAnnotationMarks } from './remove-marks';

const hasNestedTable = (tableCellNode: ADFEntity) =>
	tableCellNode.content?.some((node) => node?.type === 'table');

export interface SanitizeNodeOptions {
	/**
	 * If true, nested tables will not be transformed to a extension.
	 * This is useful when you want to keep the nested structure for further processing.
	 */
	keepNestedTables?: boolean;
}

export function sanitizeNode(json: JSONNode, options: SanitizeNodeOptions = {}): JSONNode {
	const { keepNestedTables = false } = options;

	const sanitizedJSON = traverse(json, {
		text: (node) => {
			if (!node || !Array.isArray(node.marks)) {
				return node;
			}

			return {
				...node,
				marks: node.marks.filter((mark) => mark.type !== 'typeAheadQuery'),
			};
		},
		status: (node) => {
			if (node.attrs && !!node.attrs.text) {
				return removeNonAnnotationMarks(node);
			}
			return false; // empty status
		},
		caption: (node) => {
			if (node.content) {
				return node;
			}
			return false; // empty caption
		},
		tableCell: (node) => {
			if (hasNestedTable(node)) {
				return keepNestedTables ? node : transformNestedTableNodeOutgoingDocument(node);
			}
			return;
		},
		tableHeader: (node) => {
			if (hasNestedTable(node)) {
				return keepNestedTables ? node : transformNestedTableNodeOutgoingDocument(node);
			}
			return;
		},
		emoji: removeNonAnnotationMarks,
		mention: removeNonAnnotationMarks,
		date: removeNonAnnotationMarks,
		hardBreak: removeMarks,
		inlineCard: removeNonAnnotationMarks,
	}) as JSONNode;

	return sanitizedJSON;
}
