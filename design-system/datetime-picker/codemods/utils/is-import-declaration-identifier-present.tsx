import { type JSCodeshift } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

export function isImportDeclarationIdentifierPresent(
	j: JSCodeshift,
	collection: Collection<any>,
	variableName: string,
): boolean {
	return collection
		.find(j.ImportDeclaration)
		.find(j.Identifier)
		.some((identifierPath) => identifierPath.node.name === variableName);
}
