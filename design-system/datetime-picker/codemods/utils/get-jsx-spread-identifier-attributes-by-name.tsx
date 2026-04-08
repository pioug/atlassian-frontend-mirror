import { type ASTPath, type JSCodeshift, type JSXElement, type ObjectProperty } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

export function getJSXSpreadIdentifierAttributesByName(
	j: JSCodeshift,
	collection: Collection<any>,
	jsxElementPath: ASTPath<JSXElement>,
	attributeName: string,
): Collection<ObjectProperty> | null {
	const identifierCollection = j(jsxElementPath)
		.find(j.JSXOpeningElement)
		.find(j.JSXSpreadAttribute)
		.filter((jsxSpreadAttributePath) => jsxSpreadAttributePath.node.argument.type === 'Identifier')
		.find(j.Identifier);

	if (identifierCollection.length === 0) {
		return null;
	}

	return collection
		.find(j.VariableDeclarator)
		.filter((variableDeclaratorPath) => {
			const { id } = variableDeclaratorPath.node;

			return (
				id.type === 'Identifier' &&
				identifierCollection.some((identifierPath) => identifierPath.node.name === id.name)
			);
		})
		.find(j.ObjectExpression)
		.find(j.ObjectProperty)
		.filter((objectPropertyPath) =>
			j(objectPropertyPath)
				.find(j.Identifier)
				.some((identifierPath) => identifierPath.node.name === attributeName),
		);
}
