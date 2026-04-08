import { type default as core, type JSXElement } from 'jscodeshift';

import { getJSXAttributesByName } from './get-jsx-attributes-by-name';

export function hasJSXAttributesByName({
	j,
	element,
	attributeName,
}: {
	j: core.JSCodeshift;
	element: JSXElement;
	attributeName: string;
}): boolean {
	return getJSXAttributesByName({ j, element, attributeName }).length > 0;
}
