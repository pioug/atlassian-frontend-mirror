import { type ImportDeclaration, type JSCodeshift } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

export function getImportDeclarationCollection(
	j: JSCodeshift,
	collection: Collection<any>,
	importPath: string,
): Collection<ImportDeclaration> {
	return collection
		.find(j.ImportDeclaration)
		.filter((importDeclarationPath) => importDeclarationPath.node.source.value === importPath);
}
