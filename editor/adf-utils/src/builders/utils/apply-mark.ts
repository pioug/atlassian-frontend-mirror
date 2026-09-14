import type { TextDefinition } from '@atlaskit/adf-schema/text';

import { text } from '../nodes/text';
import type { WithMark } from '../types';
import { duplicateMarkError } from './duplicate-mark-error';
import { isDuplicateMark } from './is-duplicate-mark';

export function applyMark<T>(
	mark: T & { type: string },
	maybeNode: WithMark | string,
): WithMark | TextDefinition {
	const node = typeof maybeNode === 'string' ? text(maybeNode) : maybeNode;

	if (isDuplicateMark(node, mark.type)) {
		// eslint-disable-next-line no-console
		console.error(duplicateMarkError(node, mark.type));
		return node;
	}

	node.marks = node.marks || [];
	node.marks.push(mark);
	return node;
}
