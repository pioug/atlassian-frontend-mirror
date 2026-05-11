import type { Scope } from 'eslint';
import { closestOfType } from 'eslint-codemod-utils';

import { isSafeStyleArgument } from './is-safe-style-argument';

export function isSafeCss(css: Scope.Variable): boolean {
	return css.references.every((ref) => {
		const callExpression = closestOfType(ref.identifier, 'CallExpression');
		if (!callExpression) {
			return false;
		}

		if (callExpression.callee !== ref.identifier) {
			return false;
		}

		return callExpression.arguments.every(isSafeStyleArgument);
	});
}
