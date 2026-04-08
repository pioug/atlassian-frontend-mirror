import { type ASTPath, type JSCodeshift, type JSXElement, type ObjectProperty } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

export function getJSXSpreadObjectExpressionAttributesByName(
	j: JSCodeshift,
	jsxElementPath: ASTPath<JSXElement>,
	attributeName: string,
): Collection<ObjectProperty> {
	return j(jsxElementPath)
		.find(j.JSXOpeningElement)
		.find(j.JSXSpreadAttribute)
		.find(j.ObjectExpression)
		.find(j.ObjectProperty)
		.filter((objectPropertyPath) =>
			j(objectPropertyPath)
				.find(j.Identifier)
				.some((identifierPath) => identifierPath.node.name === attributeName),
		);
}
