import type { TextDefinition } from '@atlaskit/adf-schema/text';

import { createTextFromString } from './create-text-from-string';

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createTextNodes<T = any>(nodes: Array<T | string>): Array<T | TextDefinition> {
	return nodes.map(createTextFromString);
}
