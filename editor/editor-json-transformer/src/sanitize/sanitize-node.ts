import { transformNestedTableNodeOutgoingDocument } from '@atlaskit/adf-utils/transforms';
import { traverse } from '@atlaskit/adf-utils/traverse';
import { type ADFEntity } from '@atlaskit/adf-utils/types';
import { fg } from '@atlaskit/platform-feature-flags';

import { type JSONNode } from '../types';

import { removeMarks, removeNonAnnotationMarks } from './remove-marks';

const hasNestedTable = (tableCellNode: ADFEntity) =>
	tableCellNode.content?.some((node) => node?.type === 'table');

export function sanitizeNode(json: JSONNode): JSONNode {
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
			if (hasNestedTable(node) && fg('platform_editor_use_nested_table_pm_nodes')) {
				return transformNestedTableNodeOutgoingDocument(node);
			}
		},
		tableHeader: (node) => {
			if (hasNestedTable(node) && fg('platform_editor_use_nested_table_pm_nodes')) {
				return transformNestedTableNodeOutgoingDocument(node);
			}
		},
		emoji: removeNonAnnotationMarks,
		mention: removeNonAnnotationMarks,
		date: removeNonAnnotationMarks,
		hardBreak: removeMarks,
		inlineCard: removeNonAnnotationMarks,
	}) as JSONNode;

	return sanitizedJSON;
}
