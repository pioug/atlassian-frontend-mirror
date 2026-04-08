import { type JSCodeshift } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

import { getImportDeclarationCollection } from './get-import-declaration-collection';

export function hasImportDeclaration(
	j: JSCodeshift,
	collection: Collection<any>,
	importPath: string,
): boolean {
	return getImportDeclarationCollection(j, collection, importPath).length > 0;
}
