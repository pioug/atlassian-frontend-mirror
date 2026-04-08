import { type ImportSpecifier } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

export function getImportSpecifierName(
	importSpecifierCollection: Collection<ImportSpecifier>,
): string | null {
	if (importSpecifierCollection.length === 0) {
		return null;
	}

	return importSpecifierCollection.nodes()[0]!.local!.name;
}
