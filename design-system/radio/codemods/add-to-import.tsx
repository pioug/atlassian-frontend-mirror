import { type ImportDefaultSpecifier, type ImportSpecifier, type JSCodeshift } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

export function addToImport({
	j,
	base,
	importSpecifier,
	packageName,
}: {
	j: JSCodeshift;
	base: Collection<any>;
	importSpecifier: ImportSpecifier | ImportDefaultSpecifier;
	packageName: string;
}): void {
	base
		.find(j.ImportDeclaration)
		.filter((path) => path.value.source.value === packageName)
		.replaceWith((declaration) => {
			return j.importDeclaration(
				[
					// we are appending to the existing specifiers
					// We are doing a filter hear because sometimes specifiers can be removed
					// but they hand around in the declaration
					...(declaration.value.specifiers || []).filter(
						(item) => item.type === 'ImportSpecifier' && item.imported != null,
					),
					importSpecifier,
				],
				j.literal(packageName),
			);
		});
}
