import { type ASTPath, type JSCodeshift, type JSXAttribute, type JSXElement } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

export function getJSXAttributesByName(
	j: JSCodeshift,
	jsxElementPath: ASTPath<JSXElement>,
	attributeName: string,
): Collection<JSXAttribute> {
	return j(jsxElementPath)
		.find(j.JSXOpeningElement)
		.find(j.JSXAttribute)
		.filter((jsxAttributePath) =>
			j(jsxAttributePath)
				.find(j.JSXIdentifier)
				.some((jsxIdentifierPath) => jsxIdentifierPath.node.name === attributeName),
		);
}
