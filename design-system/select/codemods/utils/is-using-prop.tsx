import { type NodePath } from 'ast-types/lib/node-path';
import { type default as core, type JSXElement } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

import { hasJSXAttributesByName } from './has-jsx-attributes-by-name';
import { isUsingThroughSpread } from './is-using-through-spread';

export function isUsingProp({
	j,
	base,
	element,
	propName,
}: {
	j: core.JSCodeshift;
	base: Collection<any>;
	element: NodePath<JSXElement, JSXElement>;
	propName: string;
}): boolean {
	return (
		hasJSXAttributesByName({
			j,
			element: element.value,
			attributeName: propName,
		}) ||
		isUsingThroughSpread({
			j,
			base,
			element,
			propName,
		})
	);
}
