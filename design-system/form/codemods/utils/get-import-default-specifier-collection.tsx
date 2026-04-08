import { type ImportDeclaration, type ImportDefaultSpecifier, type JSCodeshift } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

export function getImportDefaultSpecifierCollection(
	j: JSCodeshift,
	importDeclarationCollection: Collection<ImportDeclaration>,
): Collection<ImportDefaultSpecifier> {
	return importDeclarationCollection.find(j.ImportDefaultSpecifier);
}
