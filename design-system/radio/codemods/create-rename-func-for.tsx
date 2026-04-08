import { type JSCodeshift } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

import { getJSXAttributesByName } from './get-jsx-attributes-by-name';
import { getNamedSpecifier } from './get-named-specifier';

export const createRenameFuncFor: (
	component: string,
	importName: string,
	from: string,
	to: string,
) => (j: JSCodeshift, source: Collection<Node>) => void =
	(component: string, importName: string, from: string, to: string) =>
	(j: JSCodeshift, source: Collection<Node>) => {
		const specifier = getNamedSpecifier(j, source, component, importName);

		if (!specifier) {
			return;
		}

		source.findJSXElements(specifier).forEach((element) => {
			getJSXAttributesByName(j, element, from).forEach((attribute) => {
				j(attribute).replaceWith(j.jsxAttribute(j.jsxIdentifier(to), attribute.node.value));
			});
		});
	};
