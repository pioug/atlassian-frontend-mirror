import type * as ESTree from 'eslint-codemod-utils';

import { isSafeProperty } from './is-safe-property';

function isSafeStyleValue(value: ESTree.Expression | ESTree.Pattern): boolean {
	if (value.type === 'Literal') {
		return true;
	}

	return false;
}

export function isSafeStyleObject(object: ESTree.ObjectExpression): boolean {
	return object.properties.every((property) => isSafeProperty(property, isSafeStyleValue));
}
