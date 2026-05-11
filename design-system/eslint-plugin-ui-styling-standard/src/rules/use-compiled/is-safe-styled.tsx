import type { Scope } from 'eslint';
import { closestOfType } from 'eslint-codemod-utils';

import { isSafeStyleArgument } from './is-safe-style-argument';

export function isSafeStyled(styled: Scope.Variable): boolean {
	return styled.references.every((ref) => {
		const callExpression = closestOfType(ref.identifier, 'CallExpression');
		if (!callExpression) {
			return false;
		}

		/**
		 * If it's not in the form `styled.tagName()`
		 * then we consider it unsafe to auto-fix.
		 */
		if (
			callExpression.callee.type !== 'MemberExpression' ||
			callExpression.callee.object !== ref.identifier
		) {
			return false;
		}

		return callExpression.arguments.every(isSafeStyleArgument);
	});
}
