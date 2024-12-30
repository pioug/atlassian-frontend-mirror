import type { JSONNode } from '../index';

export function removeMarks(node: JSONNode) {
	const newNode = { ...node };

	delete newNode.marks;
	return newNode;
}

export function removeNonAnnotationMarks(node: JSONNode) {
	const newNode = { ...node };

	if (node.marks) {
		newNode.marks = node.marks.filter((mark) => mark.type === 'annotation');
	}

	return newNode;
}
