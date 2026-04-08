import { type ASTPath, type JSCodeshift, type JSXAttribute } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

export function getJSXAttributesByName(
	j: JSCodeshift,
	element: ASTPath<any>,
	attributeName: string,
): Collection<JSXAttribute> {
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
