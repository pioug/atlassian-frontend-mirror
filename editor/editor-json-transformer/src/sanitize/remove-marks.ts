/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
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

/**
 * @deprecated Use `import { removeNonAnnotationMarks } from '@atlaskit/editor-json-transformer/sanitize/remove-marks'` instead.
 */
export { removeNonAnnotationMarks } from './remove-non-annotation-marks';
