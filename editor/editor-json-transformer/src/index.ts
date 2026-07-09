// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

import type { JSONDocNode } from './types';

export type { JSONDocNode, JSONNode } from './types';

export { JSONTransformer, SchemaStage, toJSON as nodeToJSON } from './jsonTransformer';

/**
 * Quick type guard to check if a value is a valid JSONDocNode
 * This is only a basic structural check, does not validate the entire object nor the schema.
 * @param value - The value to check
 * @returns true if the value is a valid JSONDocNode structure
 */
export function isJSONDocNode(value: unknown): value is JSONDocNode {
	if (!value || typeof value !== 'object') {
		return false;
	}

	const doc = value as Record<string, unknown>;

	// Check required properties
	if (doc.type !== 'doc') {
		return false;
	}

	if (!Array.isArray(doc.content)) {
		return false;
	}

	// Version is optional but if present should be a number
	if (doc.version !== undefined && typeof doc.version !== 'number') {
		return false;
	}

	return true;
}
