import { type ImportDeclaration, type ImportSpecifier, type JSCodeshift } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

export function getImportSpecifierCollection(
	j: JSCodeshift,
	importDeclarationCollection: Collection<ImportDeclaration>,
	importName: string,
): Collection<ImportSpecifier> {
	return importDeclarationCollection
		.find(j.ImportSpecifier)
		.filter((importSpecifierPath) => importSpecifierPath.node.imported.name === importName);
}
