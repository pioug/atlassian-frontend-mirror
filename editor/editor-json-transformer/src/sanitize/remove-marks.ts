// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

import type { JSONNode } from '../types';

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
