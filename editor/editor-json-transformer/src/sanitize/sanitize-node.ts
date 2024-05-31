import { traverse } from '@atlaskit/adf-utils/traverse';

import { type JSONNode } from '../types';

import { removeMarks, removeNonAnnotationMarks } from './remove-marks';

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
		emoji: removeNonAnnotationMarks,
		mention: removeNonAnnotationMarks,
		date: removeNonAnnotationMarks,
		hardBreak: removeMarks,
		inlineCard: removeNonAnnotationMarks,
	}) as JSONNode;

	return sanitizedJSON;
}
