import type { TextDefinition } from '@atlaskit/adf-schema/text';

import { text } from '../nodes/text';

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createTextFromString<T = any>(str: T | string): T | TextDefinition {
	return typeof str === 'string' ? text(str) : str;
}
