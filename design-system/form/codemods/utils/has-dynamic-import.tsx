import { type JSCodeshift } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

import { getDynamicImportCollection } from './get-dynamic-import-collection';

export function hasDynamicImport(
	j: JSCodeshift,
	collection: Collection<any>,
	importPath: string,
): boolean {
	return getDynamicImportCollection(j, collection, importPath).length > 0;
}
