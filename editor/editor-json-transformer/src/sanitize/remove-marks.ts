import type { JSONNode } from '../index';

export function removeMarks(node: JSONNode) {
	let newNode = { ...node };

	delete newNode.marks;
	return newNode;
}

export function removeNonAnnotationMarks(node: JSONNode) {
	let newNode = { ...node };

	if (node.marks) {
		newNode.marks = node.marks.filter((mark) => mark.type === 'annotation');
	}

	return newNode;
}
