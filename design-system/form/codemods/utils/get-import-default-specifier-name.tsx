import { type ImportDefaultSpecifier } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

export function getImportDefaultSpecifierName(
	importSpecifierCollection: Collection<ImportDefaultSpecifier>,
): string | null {
	if (importSpecifierCollection.length === 0) {
		return null;
	}

	return importSpecifierCollection.nodes()[0]!.local!.name;
}
