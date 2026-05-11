import type * as ESTree from 'eslint-codemod-utils';

import { isSafeStyleObject } from './is-safe-style-object';

/**
 * Determines if a style argument is safe for auto-fix conversion.
 */
export function isSafeStyleArgument(arg: ESTree.Expression | ESTree.SpreadElement): boolean {
	if (arg.type === 'ObjectExpression') {
		return isSafeStyleObject(arg);
	}

	return false;
}
