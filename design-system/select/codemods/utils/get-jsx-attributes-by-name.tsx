import { type ASTPath, type default as core, type JSXAttribute, type JSXElement } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

export function getJSXAttributesByName({
	j,
	element,
	attributeName,
}: {
	j: core.JSCodeshift;
	element: JSXElement | ASTPath<JSXElement>;
	attributeName: string;
}): Collection<JSXAttribute> {
	return j(element)
		.find(j.JSXOpeningElement)
		.find(j.JSXAttribute)
		.filter((attribute) => {
			const matches = j(attribute)
				.find(j.JSXIdentifier)
				.filter((identifier) => identifier.value.name === attributeName);
			return Boolean(matches.length);
		});
}
