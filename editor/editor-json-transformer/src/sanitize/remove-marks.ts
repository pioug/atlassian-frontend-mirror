import type { JSONNode } from '../index';

export function removeMarks(node: JSONNode): {
	attrs?: object;
	content?: Array<JSONNode | undefined>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	marks?: any[];
	text?: string;
	type: string;
} {
	const newNode = { ...node };

	delete newNode.marks;
	return newNode;
}

export function removeNonAnnotationMarks(node: JSONNode): {
	attrs?: object;
	content?: Array<JSONNode | undefined>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	marks?: any[];
	text?: string;
	type: string;
} {
	const newNode = { ...node };

	if (node.marks) {
		newNode.marks = node.marks.filter((mark) => mark.type === 'annotation');
	}

	return newNode;
}
