import { type Identifier, type JSCodeshift } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

export function isVariableDeclaratorIdentifierPresent(
	j: JSCodeshift,
	collection: Collection<any>,
	variableName: string,
): boolean {
	return collection
		.find(j.VariableDeclaration)
		.find(j.VariableDeclarator)
		.some((variableDeclaratorPath) => {
			const { id } = variableDeclaratorPath.node;

			return !!(id && id.type === 'Identifier' && (id as Identifier).name === variableName);
		});
}
