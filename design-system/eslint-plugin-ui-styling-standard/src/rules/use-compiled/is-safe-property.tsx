import type * as ESTree from 'eslint-codemod-utils';

function hasSafeKey(property: ESTree.Property): boolean {
	if (property.computed) {
		return property.key.type === 'Literal';
	}

	return true;
}

export function isSafeProperty(
	property: ESTree.Property | ESTree.SpreadElement,
	isSafePropertyValue: (value: ESTree.Property['value']) => boolean,
): boolean {
	if (property.type === 'SpreadElement') {
		return false;
	}

	if (property.method || property.shorthand || property.kind !== 'init') {
		return false;
	}

	if (!hasSafeKey(property)) {
		return false;
	}

	return isSafePropertyValue(property.value);
}
