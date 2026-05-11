import type { Scope } from 'eslint';
import { closestOfType } from 'eslint-codemod-utils';
import type * as ESTree from 'eslint-codemod-utils';

import { isSafeProperty } from './is-safe-property';
import { isSafeStyleObject } from './is-safe-style-object';

function isSafeKeyframePropertyValue(value: ESTree.Property['value']): boolean {
	if (value.type !== 'ObjectExpression') {
		return false;
	}
	return isSafeStyleObject(value);
}

export function isSafeKeyframes(keyframes: Scope.Variable): boolean {
	return keyframes.references.every((ref) => {
		const callExpression = closestOfType(ref.identifier, 'CallExpression');
		if (!callExpression) {
			return false;
		}

		if (callExpression.callee !== ref.identifier) {
			return false;
		}

		if (callExpression.arguments.length !== 1) {
			return false;
		}

		const argument = callExpression.arguments[0];
		if (argument.type !== 'ObjectExpression') {
			return false;
		}

		return argument.properties.every((property) =>
			isSafeProperty(property, isSafeKeyframePropertyValue),
		);
	});
}
